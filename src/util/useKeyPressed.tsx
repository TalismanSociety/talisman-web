import useEventListener from '@util/useEventListener'
import useKeyDown from '@util/useKeyDown'
import useKeyUp from '@util/useKeyUp'
import { useCallback, useState } from 'react'

export const useKeyPressed = (targetKey: string): boolean => {
  const [keyPressed, setKeyPressed] = useState(false)

  useKeyDown(
    targetKey,
    useCallback(() => setKeyPressed(true), [])
  )
  useKeyUp(
    targetKey,
    useCallback(() => setKeyPressed(true), [])
  )

  return keyPressed
}
