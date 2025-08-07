"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X, Calendar, Film, Tv, Play } from "lucide-react"

export interface SearchFilters {
  year?: string
  genre?: string
  type?: "movie" | "series" | "episode"
}

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

const getAvailableGenres = () => {
  if (process.env.NEXT_PUBLIC_AVAILABLE_GENRES) {
    return process.env.NEXT_PUBLIC_AVAILABLE_GENRES.split(',').map(g => g.trim())
  }
  
  return [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
  ]
}

const popularGenres = getAvailableGenres()

const getContentTypes = () => {
  const defaultTypes = [
    { value: "movie" as const, label: "Movies", icon: Film },
    { value: "series" as const, label: "TV Series", icon: Tv },
    { value: "episode" as const, label: "Episodes", icon: Play },
  ]
  
  return defaultTypes
}

const contentTypes = getContentTypes()

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [yearInput, setYearInput] = useState(filters.year || "")

  const handleYearChange = (year: string) => {
    setYearInput(year)
    onFiltersChange({ ...filters, year: year || undefined })
  }

  const handleGenreSelect = (genre: string) => {
    const newGenre = filters.genre === genre ? undefined : genre
    onFiltersChange({ ...filters, genre: newGenre })
  }

  const handleTypeSelect = (type: "movie" | "series" | "episode") => {
    const newType = filters.type === type ? undefined : type
    onFiltersChange({ ...filters, type: newType })
  }

  const clearAllFilters = () => {
    setYearInput("")
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 relative"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50"
          >
            <Card className="w-80 shadow-lg">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Search Filters</h3>
                  <div className="flex gap-2">
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs h-auto p-1"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-auto p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Year
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 2023"
                    value={yearInput}
                    onChange={(e) => handleYearChange(e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full"
                  />
                </div>

                {/* Content Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content Type</label>
                  <div className="flex flex-wrap gap-2">
                    {contentTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <motion.div key={type.value} whileTap={{ scale: 0.95 }}>
                          <Badge
                            variant={filters.type === type.value ? "default" : "secondary"}
                            className="cursor-pointer flex items-center gap-1 hover:bg-primary/20 transition-colors"
                            onClick={() => handleTypeSelect(type.value)}
                          >
                            <Icon className="w-3 h-3" />
                            {type.label}
                          </Badge>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Genre Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {popularGenres.map((genre) => (
                      <motion.div key={genre} whileTap={{ scale: 0.95 }}>
                        <Badge
                          variant={filters.genre === genre ? "default" : "secondary"}
                          className="cursor-pointer text-xs hover:bg-primary/20 transition-colors"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-3 border-t border-border"
                  >
                    <div className="text-xs text-muted-foreground mb-2">Active Filters:</div>
                    <div className="flex flex-wrap gap-1">
                      {filters.year && (
                        <Badge variant="outline" className="text-xs">
                          Year: {filters.year}
                        </Badge>
                      )}
                      {filters.type && (
                        <Badge variant="outline" className="text-xs">
                          Type: {contentTypes.find(t => t.value === filters.type)?.label}
                        </Badge>
                      )}
                      {filters.genre && (
                        <Badge variant="outline" className="text-xs">
                          Genre: {filters.genre}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
