import { DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { ReactNode, useRef } from 'react'
import styled from 'styled-components'

interface DraggableProps {
  children: ReactNode
}

export const Droppable = styled(({ children, className, onDrop }) => {
  const ref = useRef<HTMLDivElement>(null)
  const callbacks: DragAndDropCallbacks = {
    onDragEnter(e) {
      console.log(`>>> onDragEnter`, e)
    },
    onDragLeave(e) {
      console.log(`>>> onDragLeave`, e)
      if (onDrop) {
        onDrop()
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
