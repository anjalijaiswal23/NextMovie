"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useMovieSuggestions } from "@/hooks/useMovies"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

interface SearchBarProps {
  onSearch: (query: string) => void
  onSelectMovie?: (movie: Movie) => void
}

export function SearchBar({ onSearch, onSelectMovie }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useMovieSuggestions(debouncedQuery)
  const suggestions = suggestionsData?.Search?.slice(0, 6) || []

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      if (query.length >= 2) {
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(true)
      if (query.trim()) {
        onSearch(query)
      } else if (query === "") {
        onSearch("")
      }
      setTimeout(() => setIsSearching(false), 100)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setActiveSuggestionIndex(-1)
  }

  const handleSuggestionClick = (movie: Movie) => {
    setQuery(movie.Title)
    setShowSuggestions(false)
    onSearch(movie.Title)
    if (onSelectMovie) {
      onSelectMovie(movie)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveSuggestionIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveSuggestionIndex((prev) => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        e.preventDefault()
        if (activeSuggestionIndex >= 0) {
          const selectedMovie = suggestions[activeSuggestionIndex]
          handleSuggestionClick(selectedMovie)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        break
    }
  }

  const clearSearch = () => {
    setQuery("")
    setDebouncedQuery("")
    setShowSuggestions(false)
    onSearch("")
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative max-w-md mx-auto">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 transition-colors ${
        isSearching ? "text-primary animate-pulse" : "text-muted-foreground"
      }`} />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
        className="pl-10 pr-10 py-2 w-full"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground w-4 h-4 z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Auto-complete suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto z-50"
        >
          {isLoadingSuggestions ? (
            <div className="p-3 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((movie, index) => (
              <div
                key={movie.imdbID}
                onClick={() => handleSuggestionClick(movie)}
                className={`p-3 cursor-pointer border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${
                  index === activeSuggestionIndex ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-12 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">🎬</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {movie.Title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {movie.Year} • {movie.Type === "movie" ? "Movie" : movie.Type === "series" ? "TV Series" : "Episode"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-muted-foreground text-sm">
              No movies found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
