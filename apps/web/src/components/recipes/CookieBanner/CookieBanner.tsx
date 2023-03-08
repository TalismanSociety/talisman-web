import { useTheme } from '@emotion/react'
import { X } from '@talismn/icons'
import { Button, Text } from '@talismn/ui'
import { AnimatePresence, motion } from 'framer-motion'

export type CookieBannerProps = {
  visible?: boolean
  onAccept: () => unknown
  onReject: () => unknown
  onDismiss: () => unknown
  privacyPolicyHref?: string
}

const CookieBanner = (props: CookieBannerProps) => {
  const theme = useTheme()

  return (
    <AnimatePresence>
      {props.visible && (
        <motion.form
          onSubmit={event => event.preventDefault()}
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: `solid 1px ${theme.color.onBackground}`,
            borderRadius: '1.2rem',
            padding: '1.4rem 2rem',
            backgroundColor: theme.color.background,
          }}
          exit={{ opacity: 0, y: '100%' }}
        >
          <Text.Body alpha="high">
            We use cookies to improve your experience. By clicking ‘Accept’ you consent to our use of cookies and{' '}
            <Text.Body.A href={props.privacyPolicyHref}>privacy policy</Text.Body.A>.
          </Text.Body>
          <Button variant="outlined" onClick={props.onReject} css={{ borderRadius: '2.4rem' }}>
            Reject
          </Button>
          <Button onClick={props.onAccept} css={{ borderRadius: '2.4rem' }}>
            Accept
          </Button>
          <Button variant="noop" onClick={props.onDismiss}>
            <X />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
