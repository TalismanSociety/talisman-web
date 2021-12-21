import { RefObject, useEffect, useState } from 'react'

export interface DragAndDropCallbacks {
  onDragStart?: (e?: DragEvent) => void
  onDragEnd?: (e?: DragEvent) => void
  onDragEnter?: (e?: DragEvent) => void
  onDragLeave?: (e?: DragEvent) => void
}

export function useDragAndDrop(ref: RefObject<HTMLElement>, callbacks: DragAndDropCallbacks) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    function onDragStart(e: DragEvent) {
      setDragging(true)
      if (callbacks.onDragStart) {
        callbacks.onDragStart(e)
      }
    }

    function onDragEnd(e: DragEvent) {
      setDragging(false)
      if (callbacks.onDragEnd) {
        callbacks.onDragEnd(e)
      }
    }

    function onDragEnter(e: DragEvent) {
      if (callbacks.onDragEnter) {
        callbacks.onDragEnter(e)
      }
    }

    function onDragLeave(e: DragEvent) {
      if (callbacks.onDragLeave) {
        callbacks.onDragLeave(e)
      }
    }

    const el = ref.current

    if (el) {
      el.addEventListener('dragstart', onDragStart)
      el.addEventListener('dragend', onDragEnd)
      el.addEventListener('dragenter', onDragEnter)
      el.addEventListener('dragleave', onDragLeave)
    }

    return () => {
      if (el) {
        el.removeEventListener('dragstart', onDragStart)
        el.removeEventListener('dragend', onDragEnd)
        el.removeEventListener('dragenter', onDragEnter)
        el.removeEventListener('dragleave', onDragLeave)
      }
    }
  }, [callbacks, ref])

  return { dragging }
}
