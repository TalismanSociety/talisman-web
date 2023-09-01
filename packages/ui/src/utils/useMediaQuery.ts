import { useEffect, useMemo, useState } from 'react'

export const useMediaQuery = (query: string) => {
  const matchMedia = useMemo(() => window.matchMedia(query.replace('@media', '')), [query])

  const [matches, setMatches] = useState(matchMedia.matches)

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)

    matchMedia.addEventListener('change', listener)

    return () => matchMedia.removeEventListener('change', listener)
  }, [matchMedia])

  return matches
}
