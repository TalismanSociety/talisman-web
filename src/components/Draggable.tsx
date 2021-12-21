import { DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { ReactNode, useRef } from 'react'
import styled from 'styled-components'

interface DraggableProps {
  children: ReactNode
}

export const Draggable = styled(({ id, className, children, disabled }) => {
  const ref = useRef<HTMLDivElement>(null)

  const callbacks: DragAndDropCallbacks = {
    onDragStart(e) {
      const dataTransfer = e?.dataTransfer
      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move'
        dataTransfer.setData('text/plain', id)
      }
    },
  }

  const { dragging } = useDragAndDrop(ref, disabled ? undefined : callbacks)
  const draggingStyles = dragging ? 'dragging' : ''
  const disabledStyles = disabled ? 'disabled' : ''

  return (
    <div ref={ref} draggable={!disabled} className={`${className} ${draggingStyles} ${disabledStyles}`}>
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

  &.disabled {
    pointer-events: none;
    :hover {
      cursor: not-allowed;
    }
  }
`
