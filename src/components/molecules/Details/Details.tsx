import { ChevronRight } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useCallback, useState } from 'react'

export type DetailsProps = React.DetailedHTMLProps<
  React.DetailsHTMLAttributes<HTMLDetailsElement>,
  HTMLDetailsElement
> & {
  summary: string
  content: ReactNode
}

const Details = (props: DetailsProps) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <details
      open
      {...props}
      css={{
        padding: '2.2rem 3.2rem',
        borderRadius: '1.6rem',
        backgroundColor: theme.color.surface,
      }}
    >
      <summary
        onClick={useCallback<React.MouseEventHandler<HTMLElement>>(event => {
          event.preventDefault()
          setOpen(x => !x)
        }, [])}
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
          <ChevronRight className="marker" />
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
