import { useRef, useEffect } from 'react'
import { useRecoilValueLoadable, RecoilValue, Loadable } from 'recoil'

type CachedRecoilValueLoadableReturn<T> = {
  state: Loadable<T>['state']
  contents: T | null
}

// Accept the output of waitForAll or waitForAny as a selector
export function useCachedRecoilValueLoadable<T>(selector: RecoilValue<T>): CachedRecoilValueLoadableReturn<T> {
  const loadable = useRecoilValueLoadable(selector)
  const lastLoadedValue = useRef<T | null>(null)

  useEffect(() => {
    if (loadable.state === 'hasValue') {
      const newContents = loadable.contents

      if (lastLoadedValue.current === null) {
        lastLoadedValue.current = newContents
      } else if (Array.isArray(newContents)) {
        newContents.forEach((value, index) => {
          if (value != null && !(Array.isArray(value) && value.length === 0)) {
            ;(lastLoadedValue.current as any[])[index] = value
          }
        })
      }
    }
  }, [loadable])

  return {
    state: loadable.state === 'loading' && lastLoadedValue.current ? 'hasValue' : loadable.state,
    contents: loadable.state === 'loading' ? lastLoadedValue.current : loadable.contents,
  }
}
