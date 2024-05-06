import styled from '@emotion/styled'
import { type DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { type ReactNode, useRef } from 'react'

type DraggableProps = {
  children: ReactNode
}

function isAllowed(id: string, e?: DragEvent) {
  if (!id) {
    return true
  }
  return id === e?.dataTransfer?.getData('text')
}

type DroppableProps = {
  id: string
  children?: ReactNode
  className?: string
  onDragEnter?: (e: any) => void
  onDragLeave?: (e: any) => void
  onDrop?: (e: any) => void
}

export const Droppable = styled(({ id, children, className, onDragEnter, onDragLeave, onDrop }: DroppableProps) => {
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
