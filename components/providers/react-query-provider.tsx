"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const STALE_TIME = Number(process.env.NEXT_PUBLIC_CACHE_STALE_TIME) || 5 * 60 * 1000
  const GC_TIME = Number(process.env.NEXT_PUBLIC_CACHE_GC_TIME) || 10 * 60 * 1000
  const RETRY_COUNT = Number(process.env.NEXT_PUBLIC_RETRY_COUNT) || 3

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME,
            gcTime: GC_TIME,
            retry: RETRY_COUNT,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
