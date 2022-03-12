import bannerImage from '@assets/agyle-extension.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { TALISMAN_EXTENSION_CHROMESTORE_URL } from '@util/links'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const NoWalletBanner = styled(({ className }) => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner className={className}>
      <span className="heavy">{t('noWallet.header')}</span>
      <div className="cta">
        <a href={TALISMAN_EXTENSION_CHROMESTORE_URL} target="_blank" rel="noopener noreferrer">
          <Button primary>{t('noWallet.primaryCta')}</Button>
        </a>
      </div>
    </Banner>
  )
})`
  background-image: url(${bannerImage});
  background-repeat: no-repeat;
  background-position-x: 20%;

  .heavy {
    font-family: SurtExtended, serif;
    font-size: 3.2rem;
    font-weight: 600;
    line-height: 4rem;
    max-width: 10ch;
  }
`
