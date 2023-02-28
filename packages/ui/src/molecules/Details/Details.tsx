import { useTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { MouseEventHandler, ReactEventHandler, ReactNode, useCallback, useState } from 'react'

import { Icon, Text } from '../../atoms'

export type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
> & {
  summary: string
  content: ReactNode
  onToggle?: (value: boolean) => unknown
}

const Details = (props: DetailsProps) => {
  const theme = useTheme()
  const [_open, setOpen] = useState(false)
  const open = props.open ?? _open

  return (
    <details
      {...props}
      open={true}
      css={{
        padding: '2.2rem 3.2rem',
        borderRadius: '1.6rem',
        backgroundColor: theme.color.surface,
      }}
      onToggle={useCallback<ReactEventHandler<HTMLDetailsElement>>(event => event.preventDefault(), [])}
    >
      <summary
        onClick={useCallback<MouseEventHandler<HTMLElement>>(
          event => {
            event.preventDefault()
            props.onToggle?.(!open)
            setOpen(!open)
          },
          [open, props]
        )}
        css={{
          'listStyle': 'none',
          'display': 'flex',
          'justifyContent': 'space-between',
          'alignItems': 'center',
          'cursor': 'pointer',
          '::-webkit-details-marker': {
            display: 'none',
          },
        }}
      >
        <Text.Body as="span" alpha={open ? 'high' : 'medium'} css={{ fontFamily: 'Surt', marginRight: '2rem' }}>
          {props.summary}
        </Text.Body>
        <motion.div variants={{ true: { transform: 'rotate(90deg)' } }} animate={JSON.stringify(open)}>
          <Icon.ChevronRight className="marker" />
        </motion.div>
      </summary>
      <motion.div
        variants={{ true: { opacity: 1, height: 'auto' }, false: { opacity: 0, height: 0 } }}
        animate={JSON.stringify(open)}
        initial={JSON.stringify(false)}
        css={{ overflow: 'hidden' }}
      >
        <Text.Body as="div" css={{ marginTop: '2.2rem' }}>
          {props.content}
        </Text.Body>
      </motion.div>
    </details>
  )
}

export default Details
