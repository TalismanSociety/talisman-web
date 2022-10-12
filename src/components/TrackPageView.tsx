import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function usePageTrack() {
  const { pathname } = useLocation()
  useEffect(() => {
    posthog.capture('$pageview')
  }, [pathname])
}
