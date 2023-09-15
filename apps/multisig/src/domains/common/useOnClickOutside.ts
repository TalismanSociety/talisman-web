import { useEffect } from 'react'

export const useOnClickOutside = (element: HTMLElement | undefined | null, cb: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (element && !element.contains(event.target as Node)) cb()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cb, element])
}
