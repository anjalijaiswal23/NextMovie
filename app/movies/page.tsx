"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useMovieSearchWithFilters } from "@/hooks/useMovies"
import { MovieCard } from "@/components/movie-card"
import { SearchBar } from "@/components/search-bar"
import { SearchFilters as SearchFiltersComponent } from "@/components/search-filters"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"

export default function MoviesPage() {
  const router = useRouter()
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    movies,
    totalResults,
    isLoading,
    error,
    isSearching,
    hasActiveFilters
  } = useMovieSearchWithFilters()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [setSearchQuery])

  const handleSelectMovie = useCallback(
    (movie: any) => {
      router.push(`/movies/${movie.imdbID}`)
    },
    [router],
  )

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
  }, [setFilters])

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="flex items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold mb-2">Movie Search</h1>
          <p className="text-muted-foreground">Discover and explore your favorite movies</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ThemeToggle />
        </motion.div>
      </header>

      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SearchBar onSearch={handleSearch} onSelectMovie={handleSelectMovie} />
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SearchFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
      </motion.div>

      {/* Show active filters */}
      {hasActiveFilters && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.year && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                Year: {filters.year}
              </motion.div>
            )}
            {filters.genre && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                Genre: {filters.genre}
              </motion.div>
            )}
            {filters.type && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                Type: {filters.type}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage message={error.message || "An error occurred"} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            className="flex justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isSearching && searchQuery && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">
                  {totalResults > 0
                    ? `Found ${totalResults} results for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>
              </motion.div>
            )}

            {!isSearching && hasActiveFilters && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-2">Filtered Popular Movies</h2>
                <p className="text-sm text-muted-foreground">
                  {totalResults > 0
                    ? `Found ${totalResults} popular movies matching your filters`
                    : "No popular movies match your current filters"}
                </p>
              </motion.div>
            )}

            {!isSearching && !hasActiveFilters && movies.length > 0 && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-2">Popular Movies</h2>
                <p className="text-sm text-muted-foreground">
                  Discover acclaimed films with detailed information
                </p>
              </motion.div>
            )}

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.imdbID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </motion.div>

            {movies.length === 0 && !isLoading && !isSearching && !hasActiveFilters && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground">Loading popular movies...</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
