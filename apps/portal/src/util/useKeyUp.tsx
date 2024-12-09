import { useCallback } from 'react'

import useEventListener from './useEventListener'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useKeyUp(targetKey: string, callback: () => any) {
  useEventListener(
    'keyup',
    useCallback(({ key }) => key === targetKey && callback(), [targetKey, callback])
  )
}
