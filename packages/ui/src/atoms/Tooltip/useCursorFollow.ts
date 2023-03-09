import { FloatingContext } from '@floating-ui/react'
import React, { useCallback } from 'react'

const useCursorFollow = (context: FloatingContext, options: { enabled: boolean }) => {
  const { onOpenChange, reference } = context

  const onMouseEnter = useCallback(() => {
    onOpenChange(true)
  }, [onOpenChange])

  const onMouseLeave = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const onMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      const x = ev.clientX
      const y = ev.clientY

      reference({
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          left: x,
          top: y,
          right: x,
          bottom: y,
          x,
          y,
        }),
      })
    },
    [reference]
  )

  if (!options.enabled) return {}

  return {
    reference: {
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    },
  }
}

export default useCursorFollow
