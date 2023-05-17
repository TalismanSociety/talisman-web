import { useCallback, useEffect, useMemo, useState } from 'react'

export const useBoolean = <T>(init: T) => {
  const [value, setValue] = useState(init || false)
  const toggle = useCallback(() => setValue(!value), [value])
  return [value, toggle] as const
}

export const useSet = <T>(initialSet: T[] = []) => {
  const [_set, setSet] = useState<Set<T>>(new Set(initialSet))

  const actions = useMemo(() => {
    return {
      set: (items: T[] = []) => setSet(new Set(items)),
      add: (item: T) => setSet(state => new Set([...Array.from(state), item])),
      remove: (item: T) => setSet(state => new Set(Array.from(state).filter(i => i !== item))),
      clear: () => setSet(new Set()),
      reset: () => setSet(new Set([...initialSet])),
      contains: (item: T) => _set.has(item),
    }
  }, [setSet]) // eslint-disable-line

  return [Array.from(_set), actions] as const
}

export const useMediaQuery = (query: string) => {
  const isSupported = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const mediaQueryList = isSupported ? window.matchMedia(query) : undefined
  const [match, setMatch] = useState(Boolean(mediaQueryList?.matches))

  useEffect(() => {
    const handler = () => setMatch(Boolean(mediaQueryList?.matches))

    try {
      mediaQueryList?.addEventListener('change', handler)
    } catch {
      mediaQueryList?.addListener(handler)
    }

    return () => {
      try {
        mediaQueryList?.removeEventListener('change', handler)
      } catch {
        mediaQueryList?.removeListener(handler)
      }
    }
  }, [mediaQueryList])

  return match
}
