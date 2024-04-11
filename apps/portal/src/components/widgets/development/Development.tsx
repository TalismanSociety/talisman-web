import { developmentState } from '@domains/common'
import React, { Suspense, useEffect } from 'react'
import { useRecoilState } from 'recoil'

const DevMenu = React.lazy(async () => await import('./DevMenu'))

const Development = () => {
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

export default Development
