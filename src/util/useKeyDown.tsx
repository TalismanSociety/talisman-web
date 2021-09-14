import useEventListener from '@util/useEventListener'
import { useCallback } from 'react'

export default function useKeyDown(targetKey: string, callback: () => any) {
  useEventListener(
    'keydown',
    useCallback(({ key }) => key === targetKey && callback(), [targetKey, callback])
  )
}
