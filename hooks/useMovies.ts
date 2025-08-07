import { useState, useEffect } from "react"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import type { Movie, SearchFilters, SearchResponse } from "@/lib/types"

const getQueryMinLength = () => Number(process.env.NEXT_PUBLIC_SEARCH_MIN_LENGTH) || 2
const getSearchStaleTime = () => Number(process.env.NEXT_PUBLIC_SEARCH_STALE_TIME) || 5 * 60 * 1000
const getDetailsStaleTime = () => Number(process.env.NEXT_PUBLIC_DETAILS_STALE_TIME) || 30 * 60 * 1000
const getPopularStaleTime = () => Number(process.env.NEXT_PUBLIC_POPULAR_STALE_TIME) || 10 * 60 * 1000
const getSuggestionsStaleTime = () => Number(process.env.NEXT_PUBLIC_SUGGESTIONS_STALE_TIME) || 2 * 60 * 1000
const getSearchDebounceTime = () => Number(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE) || 500
const getSuggestionsDebounceTime = () => Number(process.env.NEXT_PUBLIC_SUGGESTIONS_DEBOUNCE) || 200

export function useMovieSearch(query: string, filters: SearchFilters = {}) {
  const searchParams = new URLSearchParams()
  if (query) searchParams.append("q", query)
  if (filters.year) searchParams.append("y", filters.year)
  if (filters.type) searchParams.append("type", filters.type)

  return useQuery<SearchResponse>({
    queryKey: ["movies", "search", query, filters],
    queryFn: async () => {
      const response = await fetch(`/api/movies/search?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to search movies")
      }
      return response.json()
    },
    enabled: query.length >= getQueryMinLength(),
    staleTime: getSearchStaleTime(),
  })
}

export function useMovieDetails(imdbID: string) {
  return useQuery<Movie>({
    queryKey: ["movie", imdbID],
    queryFn: async () => {
      const response = await fetch(`/api/movies/${imdbID}`)
      if (!response.ok) {
        throw new Error("Failed to fetch movie details")
      }
      return response.json()
    },
    enabled: !!imdbID,
    staleTime: getDetailsStaleTime(),
  })
}

export function usePopularMovies(filters: SearchFilters = {}) {
  const searchParams = new URLSearchParams()
  if (filters.year) searchParams.append("y", filters.year)
  if (filters.type) searchParams.append("type", filters.type)
  if (filters.genre) searchParams.append("genre", filters.genre)

  return useQuery<SearchResponse>({
    queryKey: ["movies", "popular", filters],
    queryFn: async () => {
      const url = `/api/movies/popular${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch popular movies")
      }
      return response.json()
    },
    staleTime: getPopularStaleTime(),
  })
}

export function useMovieSuggestions(query: string) {
  return useQuery<SearchResponse>({
    queryKey: ["movies", "suggestions", query],
    queryFn: async () => {
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions")
      }
      return response.json()
    },
    enabled: query.length >= getQueryMinLength(),
    staleTime: getSuggestionsStaleTime(),
  })
}

export function useMovieSearchWithFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, getSearchDebounceTime())
    return () => clearTimeout(timer)
  }, [searchQuery])

  const hasActiveFilters = Boolean(filters.year || filters.genre || filters.type)
  
  const searchResult = useMovieSearch(debouncedQuery, filters)
  const popularResult = usePopularMovies(hasActiveFilters ? filters : {})

  const isSearching = debouncedQuery.trim().length >= getQueryMinLength()
  const movies = isSearching ? searchResult.data?.Search || [] : popularResult.data?.Search || []
  const totalResults = isSearching ? parseInt(searchResult.data?.totalResults || "0") : parseInt(popularResult.data?.totalResults || "0")
  const isLoading = isSearching ? searchResult.isLoading : popularResult.isLoading
  const error = isSearching ? searchResult.error : popularResult.error

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    movies,
    totalResults,
    isLoading,
    error,
    isSearching,
    hasActiveFilters,
  }
}
