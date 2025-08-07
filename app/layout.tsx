import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { PageTransition } from "@/components/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Movie Search App",
  description: "Search and discover movies with detailed information",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ReduxProvider>
            <ThemeProvider>
              <div className="min-h-screen bg-background text-foreground transition-colors">
                <PageTransition>{children}</PageTransition>
              </div>
            </ThemeProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
