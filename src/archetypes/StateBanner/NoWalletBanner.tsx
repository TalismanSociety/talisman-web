import { Button } from '@components'
import { Banner } from '@components/Banner'
import { WalletSelect } from '@talisman-connect/components'
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
        <NavLink to="/crowdloans">
          <Button primary>{t('noWallet.primaryCta')}</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
