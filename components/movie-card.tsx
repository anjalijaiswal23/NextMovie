"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/movies/${movie.imdbID}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
          <CardContent className="p-0">
            <motion.div 
              className="relative aspect-[2/3] overflow-hidden rounded-t-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {!imageError && movie.Poster !== "N/A" ? (
                <Image
                  src={movie.Poster || "/placeholder.svg"}
                  alt={movie.Title}
                  fill
                  className="object-cover transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No Image</span>
                </div>
              )}
            </motion.div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {movie.Title}
            </h3>
            
            {/* Genre or short description */}
            {movie.Genre && movie.Genre !== "N/A" ? (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {movie.Genre}
              </p>
            ) : movie.Plot && movie.Plot !== "N/A" ? (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {movie.Plot.length > 80 ? `${movie.Plot.substring(0, 80)}...` : movie.Plot}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mb-3">
                {movie.Type === "movie" ? "Feature Film" : 
                 movie.Type === "series" ? "TV Series" : 
                 movie.Type === "episode" ? "TV Episode" : 
                 "Entertainment"}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {movie.Year}
              </Badge>
              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs font-medium">{movie.imdbRating}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    </motion.div>
  )
}
