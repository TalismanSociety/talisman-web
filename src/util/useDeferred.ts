import { useRef } from 'react'

const useDeferred = <T>() => {
  const resolveRef = useRef<(value: T) => unknown>()
  const rejectRef = useRef<(value: any) => unknown>()
  const promiseRef = useRef(
    new Promise<T>((resolve, reject) => {
      resolveRef.current = resolve
      rejectRef.current = reject
    })
  )

  return { promise: promiseRef.current!, resolve: resolveRef.current!, reject: rejectRef.current! }
}

export default useDeferred
