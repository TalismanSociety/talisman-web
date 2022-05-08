import bannerImage from '@assets/talisman-hands.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export const ExploreCrowdloansBanner = () => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('explore.header')}</h1>
        <p>{t('explore.description')}</p>
      </div>
      <div className="cta">
        <NavLink to="/crowdloans">
          <Button primary>{t('explore.primaryCta')}</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
