import { useTheme } from '@emotion/react'
import { motion, useMotionValue } from 'framer-motion'
import { MouseEventHandler, ReactNode, useCallback, useId, useState } from 'react'
import ReactDOM from 'react-dom'

import Text from '../Text'

export type TooltipProps = {
  content: ReactNode
  children: (props: {
    'aria-labelledby': string
    'onMouseEnter'?: MouseEventHandler<any>
    'onMouseMove'?: MouseEventHandler<any>
    'onMouseLeave'?: MouseEventHandler<any>
  }) => ReactNode
}

const X_OFFSET = 12
const Y_OFFSET = 6

const Tooltip = (props: TooltipProps) => {
  const theme = useTheme()
  const id = useId()
  const [mouseOver, setMouseOver] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  return (
    <div>
      {props.children({
        'aria-labelledby': id,
        'onMouseEnter': useCallback<MouseEventHandler<any>>(
          event => {
            setMouseOver(true)
            x.set(event.clientX + X_OFFSET)
            y.set(event.clientY - Y_OFFSET)
          },
          [x, y]
        ),
        'onMouseLeave': useCallback(() => setMouseOver(false), []),
        'onMouseMove': useCallback<MouseEventHandler<any>>(
          event => {
            x.set(event.clientX + X_OFFSET)
            y.set(event.clientY - Y_OFFSET)
          },
          [x, y]
        ),
      })}
      {Boolean(props.content) &&
        ReactDOM.createPortal(
          <motion.div
            layout
            id={id}
            role="tooltip"
            css={{
              position: 'fixed',
              pointerEvents: 'none',
              backgroundColor: theme.color.foregroundVariant,
              padding: '0.6rem',
              borderRadius: '0.4rem',
            }}
            style={{ opacity: mouseOver ? 1 : 0, top: y, left: x }}
          >
            <Text.Body as="div">{props.content}</Text.Body>
          </motion.div>,
          document.body
        )}
    </div>
  )
}

export default Tooltip
