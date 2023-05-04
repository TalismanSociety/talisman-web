import { useTheme } from '@emotion/react'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'

import Text from '../Text'
import useCursorFollow from './useCursorFollow'
import FloatingPortal from '../FloatingPortal'

export type TooltipProps = {
  content: ReactNode
  placement?: 'bottom' | 'left' | 'right' | 'top'
  children: (props: Record<string, unknown>) => ReactNode
}

const Tooltip = ({ placement = 'right', ...props }: TooltipProps) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const { x, y, strategy, refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: 'fixed',
    middleware: [offset({ mainAxis: 10, crossAxis: 10 }), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false }),
    useCursorFollow(context, { enabled: true }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ])

  return (
    <>
      {props.children(getReferenceProps({}))}
      <FloatingPortal>
        {open && Boolean(props.content) && (
          <motion.div
            ref={refs.setFloating}
            css={{
              pointerEvents: 'none',
              backgroundColor: theme.color.foregroundVariant,
              padding: '0.6rem',
              borderRadius: '0.4rem',
              zIndex: 50,
            }}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'fit-content',
            }}
            {...getFloatingProps()}
          >
            <Text.Body as="div">{props.content}</Text.Body>
          </motion.div>
        )}
      </FloatingPortal>
    </>
  )
}

export default Tooltip
