import bannerImage from '@assets/talisman-hands.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'

export const EmptyBagsBanner = ({ onClick }) => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('empty.header')}</h1>
        <p>{t('empty.description')}</p>
      </div>
      <div className="cta">
        <Button primary onClick={onClick}>
          {t('empty.primaryCta')}
        </Button>
      </div>
    </Banner>
  )
}
