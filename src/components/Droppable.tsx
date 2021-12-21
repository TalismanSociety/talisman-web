import { DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { ReactNode, useRef } from 'react'
import styled from 'styled-components'

interface DraggableProps {
  children: ReactNode
}

function isAllowed(id: string, e?: DragEvent) {
  if (!id) {
    return true
  }
  return id === e?.dataTransfer?.getData('text')
}

export const Droppable = styled(({ id, children, className, onDragEnter, onDragLeave, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null)
  const callbacks: DragAndDropCallbacks = {
    onDragEnter(e) {
      if (onDragEnter) {
        onDragEnter(e)
      }
    },
    onDragLeave(e) {
      if (onDragLeave) {
        onDragLeave(e)
      }
    },
    onDrop(e) {
      if (onDrop && isAllowed(id, e)) {
        onDrop(e)
      }
    },
  }
  useDragAndDrop(ref, callbacks)

  return (
    <div ref={ref} draggable className={className}>
      {children}
    </div>
  )
})<DraggableProps>`
  :hover {
    cursor: pointer;
  }
`
