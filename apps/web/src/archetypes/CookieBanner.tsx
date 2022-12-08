import BaseCookieBanner from '@components/recipes/CookieBanner'
import posthog from 'posthog-js'
import { useCallback, useState } from 'react'

const CookieBanner = () => {
  const [visible, setVisible] = useState(!posthog.has_opted_in_capturing() && !posthog.has_opted_out_capturing())

  return (
    <div css={{ position: 'fixed', right: '1.5rem', bottom: '2.4rem' }}>
      <BaseCookieBanner
        privacyPolicyHref="https://docs.talisman.xyz/talisman/prepare-for-your-journey/privacy-policy"
        visible={visible}
        onAccept={useCallback(() => {
          posthog.opt_in_capturing()
          setVisible(false)
        }, [])}
        onReject={useCallback(() => {
          posthog.opt_in_capturing()
          setVisible(false)
        }, [])}
        onDismiss={useCallback(() => setVisible(false), [])}
      />
    </div>
  )
}

export default CookieBanner
