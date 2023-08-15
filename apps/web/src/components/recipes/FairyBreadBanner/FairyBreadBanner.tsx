import { useTheme } from '@emotion/react'
import { X } from '@talismn/icons'
import { Button, Text } from '@talismn/ui'
import { AnimatePresence, motion } from 'framer-motion'

export type FairyBreadBannerProps = {
  visible?: boolean
  onAccept: () => unknown
  onReject: () => unknown
  onDismiss: () => unknown
  privacyPolicyHref?: string
}

const FairyBreadBanner = (props: FairyBreadBannerProps) => {
  const theme = useTheme()

  return (
    <AnimatePresence>
      {props.visible && (
        <motion.form
          onSubmit={event => event.preventDefault()}
          css={{
            'position': 'relative',
            'display': 'flex',
            'alignItems': 'center',
            'flexWrap': 'wrap',
            'gap': '2rem 1rem',
            'border': `solid 1px ${theme.color.onBackground}`,
            'borderRadius': '1.2rem',
            'padding': '2.4rem 3.2rem',
            'backgroundColor': theme.color.background,
            '@media(min-width: 1024px)': {
              flexWrap: 'nowrap',
            },
          }}
          exit={{ opacity: 0, y: '100%' }}
        >
          <Text.Body alpha="high">
            We use cookies to improve your experience. By clicking ‘Accept’ you consent to our use of cookies and{' '}
            <Text.Body.A href={props.privacyPolicyHref}>privacy policy</Text.Body.A>.
          </Text.Body>
          <div css={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <Button variant="outlined" onClick={props.onReject} css={{ borderRadius: '2.4rem' }}>
              Reject
            </Button>
            <Button onClick={props.onAccept} css={{ borderRadius: '2.4rem' }}>
              Accept
            </Button>
          </div>
          <Button
            variant="noop"
            onClick={props.onDismiss}
            css={{
              'position': 'absolute',
              'top': '0.8rem',
              'right': '0.8rem',
              '@media(min-width: 1024px)': {
                position: 'relative',
                top: 'unset',
                right: 'unset',
              },
            }}
          >
            <X />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default FairyBreadBanner
