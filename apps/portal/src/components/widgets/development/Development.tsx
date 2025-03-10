import { lazy, Suspense, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { developmentState } from '@/domains/common/recoils/development'

const DevMenu = lazy(async () => await import('./DevMenu'))

export const Development = () => {
  const [isDevelopment, setIsDevelopment] = useRecoilState(developmentState)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)

    if (search.get('development') !== null) {
      sessionStorage.setItem('development', JSON.stringify(true))
    }

    if (JSON.parse(sessionStorage.getItem('development') ?? JSON.stringify(false))) {
      setIsDevelopment(true)
    }
  }, [setIsDevelopment])

  if (!isDevelopment) {
    return null
  }

  return (
    <Suspense>
      <DevMenu />
    </Suspense>
  )
}
