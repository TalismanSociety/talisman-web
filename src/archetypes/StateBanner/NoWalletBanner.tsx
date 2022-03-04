import { Button } from '@components'
import { Banner } from '@components/Banner'
import { DAPP_NAME } from '@libs/talisman'
import { WalletSelect } from '@talisman-connect/components'
import { TALISMAN_EXTENSION_CHROMESTORE_URL } from '@util/links'
import { Trans, useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

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
            <WalletSelect
              dappName={DAPP_NAME}
              triggerComponent={
                <span style={{ textDecoration: 'underline', color: 'inherit', opacity: 'inherit', cursor: 'pointer' }}>
                  Talisman Wallet.
                </span>
              }
              onWalletSelected={wallet => {}}
            />
          </Trans>
        </p>
        <p>{t('noWallet.description2')}</p>
      </div>
      <div className="cta">
        <a href={TALISMAN_EXTENSION_CHROMESTORE_URL} target="_blank" rel="noopener noreferrer">
          <Button primary>{t('noWallet.primaryCta')}</Button>
        </a>
      </div>
    </Banner>
  )
}
