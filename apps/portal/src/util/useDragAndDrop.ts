import { type RefObject, useEffect, useState } from 'react'

export type DragAndDropCallbacks = {
  onDragStart?: (e?: DragEvent) => void
  onDragEnd?: (e?: DragEvent) => void
  onDragEnter?: (e?: DragEvent) => void
  onDragLeave?: (e?: DragEvent) => void
  onDragOver?: (e?: DragEvent) => void
  onDrop?: (e?: DragEvent) => void
}

export function useDragAndDrop(ref: RefObject<HTMLElement>, callbacks?: DragAndDropCallbacks) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    function onDragStart(e: DragEvent) {
      setDragging(true)
      if (callbacks?.onDragStart) {
        callbacks?.onDragStart(e)
      }
    }

    function onDragEnd(e: DragEvent) {
      e?.preventDefault()
      setDragging(false)
      if (callbacks?.onDragEnd) {
        callbacks?.onDragEnd(e)
      }
    }

    function onDragEnter(e: DragEvent) {
      e?.preventDefault()
      if (callbacks?.onDragEnter) {
        callbacks?.onDragEnter(e)
      }
    }

    function onDragLeave(e: DragEvent) {
      e?.preventDefault()
      if (callbacks?.onDragLeave) {
        callbacks?.onDragLeave(e)
      }
    }

    function onDragOver(e: DragEvent) {
      e?.preventDefault()
      if (callbacks?.onDragOver) {
        callbacks?.onDragOver(e)
      }
    }

    function onDrop(e: DragEvent) {
      e?.preventDefault()
      if (callbacks?.onDrop) {
        callbacks?.onDrop(e)
      }
    }

    const el = ref.current

    if (el) {
      el.addEventListener('dragstart', onDragStart)
      el.addEventListener('dragend', onDragEnd)
      el.addEventListener('dragenter', onDragEnter)
      el.addEventListener('dragleave', onDragLeave)
      el.addEventListener('dragover', onDragOver)
      el.addEventListener('drop', onDrop)
    }

    return () => {
      if (el) {
        el.removeEventListener('dragstart', onDragStart)
        el.removeEventListener('dragend', onDragEnd)
        el.removeEventListener('dragenter', onDragEnter)
        el.removeEventListener('dragleave', onDragLeave)
        el.removeEventListener('dragover', onDragOver)
        el.removeEventListener('drop', onDrop)
      }
    }
  }, [callbacks, ref])

  return { dragging }
}
