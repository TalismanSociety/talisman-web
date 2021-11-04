import bannerImage from '@assets/talisman-hands.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const LearnCrowdloansBanner = styled(props => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner {...props}>
      <div className="image" />
      <div className="body">
        <div className="description">
          <p>{t('learnCrowdloans.description')}</p>
        </div>
        <div className="cta">
          <Button primary>{t('learnCrowdloans.primaryCta')}</Button>
        </div>
      </div>
    </Banner>
  )
})`
  .image {
    // width: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${bannerImage}');
  }
  //   padding: 0;

  //   .body {
  //     padding: 0 4rem;
  //   }
`
