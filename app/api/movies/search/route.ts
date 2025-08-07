import { type NextRequest, NextResponse } from "next/server"

const OMDB_API_KEY = process.env.OMDB_API_KEY || "demo"
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || "http://www.omdbapi.com"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const year = searchParams.get("y")
  const type = searchParams.get("type")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const omdbParams = new URLSearchParams({
      s: query,
      apikey: OMDB_API_KEY,
    })

    if (year) omdbParams.append("y", year)
    if (type) omdbParams.append("type", type)

    const response = await fetch(`${OMDB_BASE_URL}/?${omdbParams.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch from OMDB API")
    }

    const data = await response.json()

    if (data.Response === "False") {
      return NextResponse.json({ Search: [], totalResults: "0" })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching movies:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
