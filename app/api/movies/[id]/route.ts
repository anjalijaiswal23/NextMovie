import { type NextRequest, NextResponse } from "next/server"

const OMDB_API_KEY = process.env.OMDB_API_KEY || "demo"
const OMDB_BASE_URL = process.env.OMDB_BASE_URL || "http://www.omdbapi.com"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${OMDB_BASE_URL}/?i=${id}&apikey=${OMDB_API_KEY}&plot=full`)

    if (!response.ok) {
      throw new Error("Failed to fetch from OMDB API")
    }

    const data = await response.json()

    if (data.Response === "False") {
      return NextResponse.json({ error: data.Error }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
