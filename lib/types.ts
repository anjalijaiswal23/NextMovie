export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
  Plot?: string
  Director?: string
  Actors?: string
  Genre?: string
  Runtime?: string
  imdbRating?: string
  userRating?: number
}

export interface SearchFilters {
  year?: string
  genre?: string
  type?: "movie" | "series" | "episode"
}

export interface SearchResponse {
  Search: Movie[]
  totalResults: string
  Response: string
}
