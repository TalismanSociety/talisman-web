import { useTheme } from '@emotion/react'
import { motion, useMotionValue } from 'framer-motion'
import { MouseEventHandler, ReactNode, useCallback, useId, useState } from 'react'

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
        'onMouseEnter': useCallback(() => setMouseOver(true), []),
        'onMouseLeave': useCallback(() => setMouseOver(false), []),
        'onMouseMove': event => {
          x.set(event.clientX + 12)
          y.set(event.clientY - 6)
        },
      })}
      {Boolean(props.content) && (
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
        </motion.div>
      )}
    </div>
  )
}

export default Tooltip
