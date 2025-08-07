"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setTheme } from "@/lib/features/themeSlice"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      dispatch(setTheme(savedTheme === "dark"))
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      dispatch(setTheme(prefersDark))
    }
  }, [dispatch])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return <>{children}</>
}
