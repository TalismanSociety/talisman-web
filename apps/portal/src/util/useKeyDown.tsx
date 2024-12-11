import { useCallback } from 'react'

import useEventListener from './useEventListener'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useKeyDown(targetKey: string, callback: () => any) {
  useEventListener(
    'keydown',
    useCallback(({ key }) => key === targetKey && callback(), [targetKey, callback])
  )
}
