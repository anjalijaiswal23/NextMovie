import { type NextRequest, NextResponse } from "next/server"

const OMDB_API_KEY = process.env.OMDB_API_KEY || "demo"
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || "http://www.omdbapi.com"

function generateSearchTerms(genre?: string, year?: string): string[] {
  const terms: string[] = []
  
  if (year) {
    terms.push(year)
  }
  
  if (genre) {
    terms.push(genre.toLowerCase())
  }
  
  const qualityTerms = (process.env.QUALITY_SEARCH_TERMS || "popular,acclaimed,award,winning,hit,successful,top,best,famous,great").split(',')
  terms.push(...qualityTerms.slice(0, 5))
  
  const baseTerms = (process.env.BASE_SEARCH_TERMS || "movie,film,cinema,entertainment").split(',')
  terms.push(...baseTerms.slice(0, 3))
  
  return terms.filter(term => term.trim().length > 0).slice(0, 10)
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const yearFilter = searchParams.get("y")
    const typeFilter = searchParams.get("type")
    const genreFilter = searchParams.get("genre")

    const searchTerms = generateSearchTerms(genreFilter || undefined, yearFilter || undefined)

    const allMovies = new Map()
    
    for (const term of searchTerms.slice(0, 6)) {
      try {
        const omdbParams = new URLSearchParams({
          s: term,
          apikey: OMDB_API_KEY,
        })

        if (yearFilter) omdbParams.append("y", yearFilter)
        if (typeFilter) omdbParams.append("type", typeFilter)

        const response = await fetch(`${OMDB_BASE_URL}/?${omdbParams.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.Response !== "False" && data.Search) {
            data.Search.forEach((movie: any) => {
              if (!allMovies.has(movie.imdbID)) {
                if (genreFilter) {
                  allMovies.set(movie.imdbID, { ...movie, needsGenreCheck: true })
                } else {
                  allMovies.set(movie.imdbID, movie)
                }
              }
            })
          }
        }
      } catch (error) {
        console.error(`Error searching for term "${term}":`, error)
      }
    }

    let finalMovies = Array.from(allMovies.values())

    if (genreFilter) {
      const detailedMoviePromises = finalMovies.slice(0, 30).map(async (movie) => {
        try {
          const response = await fetch(`${OMDB_BASE_URL}/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`)
          if (response.ok) {
            const data = await response.json()
            if (data.Response !== "False" && data.Genre) {
              if (data.Genre.toLowerCase().includes(genreFilter.toLowerCase())) {
                return data
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching details for ${movie.imdbID}:`, error)
        }
        return null
      })

      const detailedMovies = await Promise.all(detailedMoviePromises)
      finalMovies = detailedMovies.filter(movie => movie !== null)
    }

    finalMovies.sort((a, b) => {
      const ratingA = parseFloat(a.imdbRating) || 0
      const ratingB = parseFloat(b.imdbRating) || 0
      return ratingB - ratingA
    })

    const topMovies = finalMovies.slice(0, 10)

    return NextResponse.json({
      Search: topMovies,
      totalResults: topMovies.length.toString(),
      Response: "True"
    })

  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 })
  }
}
