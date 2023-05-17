import styled from '@emotion/styled'
import { type DragAndDropCallbacks, useDragAndDrop } from '@util/useDragAndDrop'
import { type ReactNode, useRef } from 'react'

type DraggableProps = {
  children: ReactNode
  id: string
  className?: string
  disabled?: boolean
}

export const Draggable = styled(({ id, className, children, disabled }: DraggableProps) => {
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
    <div ref={ref} draggable={!disabled} className={`${className ?? ''} ${draggingStyles} ${disabledStyles}`}>
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
