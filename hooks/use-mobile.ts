"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A custom hook that determines if the current screen width is below a mobile breakpoint.
 * - Listens for changes in screen size and updates the component accordingly.
 * - Useful for applying mobile-specific logic or styles.
 *
 * @returns {boolean} A boolean value indicating whether the screen is in a mobile view.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * A custom hook that tracks the state of a CSS media query.
 * - Listens for changes in the media query and updates the component when the query's state changes.
 * - This is useful for creating responsive components that adapt to different screen sizes.
 *
 * @param {string} query - The CSS media query to track (e.g., "(max-width: 768px)").
 * @returns {boolean} A boolean value indicating whether the media query currently matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    // Set initial value
    setMatches(mediaQuery.matches)

    // Add listener
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [query])

  return matches
}
