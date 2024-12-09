import type { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useRef } from 'react'

import type { DragAndDropCallbacks } from '@/util/useDragAndDrop'
import { useDragAndDrop } from '@/util/useDragAndDrop'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDragEnter?: (e: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDragLeave?: (e: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
