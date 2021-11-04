import { Button } from '@components'
import { Banner } from '@components/Banner'
import { Trans, useTranslation } from 'react-i18next'

export const NoWalletBanner = () => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner>
      <div className="description">
        <h1>{t('noWallet.header')}</h1>
        <p>
          <Trans i18nKey="noWallet.description" ns="banners">
            It doesn't look like you’ve got a wallet extension installed. We recommend downloading
            <a
              href="https://polkadot.js.org/extension"
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: 'underline' }}
            >
              Polkadot.js
            </a>
          </Trans>
        </p>
        <p>{t('noWallet.description2')}</p>
      </div>
      <div className="cta">
        <a href="https://polkadot.js.org/extension" target="_blank" rel="noreferrer noopener">
          <Button primary>{t('noWallet.primaryCta')}</Button>
        </a>
      </div>
    </Banner>
  )
}
