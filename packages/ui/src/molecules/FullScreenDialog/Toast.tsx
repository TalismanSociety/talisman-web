import { useMemo, type ReactNode } from 'react'
import { ListItem } from '..'
import { CircularProgressIndicator } from '../..'
import { Check, X } from '@talismn/icons'
import { motion } from 'framer-motion'
import { useTheme } from '@emotion/react'

type FullScreenDialogToastProps = {
  type: 'loading' | 'success' | 'error'
  headlineText: ReactNode
}

const FullScreenDialogToast = (props: FullScreenDialogToastProps) => {
  const theme = useTheme()

  const icon = useMemo(() => {
    switch (props.type) {
      case 'loading':
        return (
          <motion.div
            css={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '4rem',
              height: '4rem',
            }}
          >
            <CircularProgressIndicator size="2rem" />
          </motion.div>
        )
      case 'success':
        return (
          <div
            css={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '2rem',
              backgroundColor: 'rgba(56, 212, 72, 0.25)',
              color: '#38D448',
            }}
          >
            <Check size="2rem" />
          </div>
        )
      case 'error':
        return (
          <div
            css={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '4rem',
              height: '4rem',
              borderRadius: '2rem',
              backgroundColor: 'rgba(210, 36, 36, 0.25)',
              color: '#D22424',
            }}
          >
            <X size="2rem" />
          </div>
        )
    }
  }, [props.type])

  return (
    <motion.div animate={{}}>
      <ListItem
        leadingContent={icon}
        headlineText={props.headlineText}
        css={{ paddingLeft: 0, paddingRight: 0, backgroundColor: theme.color.background }}
      />
    </motion.div>
  )
}

export default FullScreenDialogToast
