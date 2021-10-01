import { useCallback, useEffect, useMemo, useState } from 'react'

export const useBoolean = init => {
  const [value, setValue] = useState(init || false)
  const toggle = useCallback(() => setValue(!value), [value])
  return [value, toggle]
}

export const useSet = (initialSet = []) => {
  const [_set, setSet] = useState(new Set(initialSet))

  const actions = useMemo(() => {
    return {
      set: (items = []) => setSet(new Set(items)),
      add: item => setSet(state => new Set([...Array.from(state), item])),
      remove: item => setSet(state => new Set(Array.from(state).filter(i => i !== item))),
      clear: () => setSet(new Set()),
      reset: () => setSet(new Set([...initialSet])),
      contains: item => _set.has(item),
    }
  }, [setSet]) // eslint-disable-line

  return [Array.from(_set), actions]
}

export const useMediaQuery = query => {
  const isSupported = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const mediaQueryList = isSupported ? window.matchMedia(query) : undefined
  const [match, setMatch] = useState(Boolean(mediaQueryList?.matches))

  useEffect(() => {
    const handler = () => setMatch(Boolean(mediaQueryList?.matches))

    try {
      mediaQueryList && mediaQueryList.addEventListener('change', handler)
    } catch {
      mediaQueryList && mediaQueryList.addListener(handler)
    }

    return () => {
      try {
        mediaQueryList && mediaQueryList.removeEventListener('change', handler)
      } catch {
        mediaQueryList && mediaQueryList.removeListener(handler)
      }
    }
  }, [mediaQueryList])

  return match
}
