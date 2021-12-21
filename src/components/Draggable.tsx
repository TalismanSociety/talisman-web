import { DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { ReactNode, useRef } from 'react'
import styled from 'styled-components'

interface DraggableProps {
  children: ReactNode
}

export const Draggable = styled(({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null)

  const callbacks: DragAndDropCallbacks = {
    onDragStart(e) {
      console.log(`>>> onDragStart`, e)
    },
    onDragEnd(e) {
      console.log(`>>> onDragEnd`, e)
    },
  }

  const { dragging } = useDragAndDrop(ref, callbacks)
  const draggingStyles = dragging ? `dragging` : ``

  return (
    <div ref={ref} draggable className={`${className} ${draggingStyles}`}>
      {children}
    </div>
  )
})<DraggableProps>`
  :hover {
    cursor: pointer;
  }

  &.dragging {
    opacity: 0.1;
  }
`
