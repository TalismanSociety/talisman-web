import bannerImage from '@assets/talisman-hands.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export const ComingSoonBanner = () => {
  const { t } = useTranslation('banners')
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('soon.header')}</h1>
        <p>{t('soon.description')}</p>
      </div>
      <div className="cta">
        <NavLink to="/crowdloans">
          <Button primary>{t('soon.primaryCta')}</Button>
        </NavLink>
      </div>
    </Banner>
  )
}
