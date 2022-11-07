import useEventListener from '@util/useEventListener'
import { useCallback } from 'react'

export default function useKeyUp(targetKey: string, callback: () => any) {
  useEventListener(
    'keyup',
    useCallback(({ key }) => key === targetKey && callback(), [targetKey, callback])
  )
}
