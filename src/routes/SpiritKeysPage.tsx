import { ReactComponent as BannerText } from '@assets/unlock-the-paraverse.svg'
import { DesktopRequired } from '@components'
import { StyledLoader } from '@components/Await'
import { BenefitsInfo } from '@libs/spiritkey/BenefitsInfo'
import { SpiritKeyUnlockBanner } from '@libs/spiritkey/SpiritKeyUnlockBanner'
import { WhatIsInfo } from '@libs/spiritkey/WhatIsInfo'
import { useAllAccountAddresses } from '@libs/talisman'
import { isMobileBrowser } from '@util/helpers'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const SpiritKeyPage = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const addresses = useAllAccountAddresses()
  const addressesLoading = addresses === undefined

  if (addressesLoading) {
    return <StyledLoader />
  }

  return (
    <section className={className}>
      {isMobileBrowser() && <DesktopRequired />}
      <div className="content">
        <BannerText className="banner-text" />
        <SpiritKeyUnlockBanner />
        <h1 className="intro">{t('intro')}</h1>
        <div className="info">
          <div className="section">
            <WhatIsInfo />
          </div>
          <div className="section">
            <BenefitsInfo />
          </div>
        </div>
      </div>
    </section>
  )
})`
  color: var(--color-text);

  a {
    text-decoration: underline;
  }

  .info {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  .banner-text {
    width: 100%;
    height: auto;
    margin: 4rem 0;
    padding: 0 4rem;
  }

  .intro {
    color: var(--color-text);
    padding: 4rem;
    text-align: center;
  }

  > .content {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;

    padding: 0 5vw;
    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: column;
  }
`

export default SpiritKeyPage
