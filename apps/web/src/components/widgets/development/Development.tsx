import React, { Suspense, useEffect, useState } from 'react'

const DevMenu = React.lazy(async () => await import('./DevMenu'))

const Development = () => {
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)

    if (search.get('development') !== null) {
      sessionStorage.setItem('development', JSON.stringify(true))
    }

    if (JSON.parse(sessionStorage.getItem('development') ?? JSON.stringify(false))) {
      setIsDevelopment(true)
    }
  }, [])

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
