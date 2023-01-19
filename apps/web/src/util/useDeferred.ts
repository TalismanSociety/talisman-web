import { DependencyList, useMemo } from 'react'

const useDeferred = <T>(deps: DependencyList = []) => {
  const resolver = useMemo<{ resolve?: (value: T) => unknown; reject?: (value: any) => unknown }>(
    () => ({ resolve: undefined, reject: undefined }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )

  const promise = useMemo(
    () =>
      new Promise<T>((resolve, reject) => {
        resolver.resolve = resolve
        resolver.reject = reject
      }),
    [resolver]
  )

  return { promise, resolve: resolver.resolve!, reject: resolver.reject! }
}

export default useDeferred
