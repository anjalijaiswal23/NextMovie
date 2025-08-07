"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import type { Movie } from "@/lib/types"

interface MovieDetailsProps {
  movie: Movie
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const [imageError, setImageError] = useState(false)
  const [userRating, setUserRatingState] = useState(movie.userRating || 0)

  useEffect(() => {
    const savedRating = localStorage.getItem(`rating-${movie.imdbID}`)
    if (savedRating) {
      const rating = Number.parseInt(savedRating)
      setUserRatingState(rating)
    }
  }, [movie.imdbID])

  const handleRatingChange = (rating: number) => {
    setUserRatingState(rating)
    localStorage.setItem(`rating-${movie.imdbID}`, rating.toString())
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              {!imageError && movie.Poster !== "N/A" ? (
                <Image
                  src={movie.Poster || "/placeholder.svg"}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Your Rating</h3>
            <StarRating rating={userRating} onRatingChange={handleRatingChange} size="lg" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">{movie.Title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{movie.Year}</Badge>
            {movie.Runtime && <Badge variant="outline">{movie.Runtime}</Badge>}
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{movie.imdbRating}/10</span>
                <span className="text-muted-foreground text-sm">IMDb</span>
              </div>
            )}
          </div>
        </div>

        {movie.Plot && movie.Plot !== "N/A" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-3">Plot</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.Plot}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {movie.Director && movie.Director !== "N/A" && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Director</h3>
                <p className="text-muted-foreground">{movie.Director}</p>
              </CardContent>
            </Card>
          )}

          {movie.Genre && movie.Genre !== "N/A" && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Genre</h3>
                <div className="flex flex-wrap gap-1">
                  {movie.Genre.split(", ").map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {movie.Actors && movie.Actors !== "N/A" && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-3">Cast</h2>
              <p className="text-muted-foreground">{movie.Actors}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
