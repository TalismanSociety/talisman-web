import bannerImage from '@assets/talisman-hands.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'

export const BuyBanner = ({ onClick }) => {
  const { t } = useTranslation('banners')
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('buy.header')}</h1>
        <p>{t('buy.description')}</p>
      </div>
      <div className="cta">
        <Button primary onClick={onClick}>
          {t('buy.primaryCta')}
        </Button>
      </div>
    </Banner>
  )
}
