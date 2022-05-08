import bannerImage from '@assets/agyle-extension.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { DAPP_NAME } from '@libs/talisman'
import { useTalismanInstalled } from '@libs/talisman/useIsTalismanInstalled'
import { WalletSelect } from '@talisman-connect/components'
import getDownloadLink from '@util/getDownloadLink'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const NoWalletBanner = styled(({ className }) => {
  const { t } = useTranslation('banners')
  const { t: tBase } = useTranslation('banners')
  const isTalismanInstalled = useTalismanInstalled()
  const downloadLink = getDownloadLink()

  return (
    <Banner className={className}>
      <span className="heavy">{t('noWallet.header')}</span>
      <div className="cta">
        {isTalismanInstalled && (
          <WalletSelect dappName={DAPP_NAME} triggerComponent={<Button primary>{tBase('Connect wallet')}</Button>} />
        )}
        {!isTalismanInstalled && (
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            <Button primary>{t('noWallet.primaryCta')}</Button>
          </a>
        )}
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
