import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'

export const NoWalletBanner = () => {
  const { t } = useTranslation('banners')
  return (
    <Banner>
      <div className="description">
        <h1>{t('noWallet.header')}</h1>
        <p>{t('noWallet.description')}</p>
      </div>
      <div className="cta">
        <a href="https://polkadot.js.org/extension" target="_blank" rel="noreferrer noopener">
          <Button primary>{t('noWallet.primaryCta')}</Button>
        </a>
      </div>
    </Banner>
  )
}
