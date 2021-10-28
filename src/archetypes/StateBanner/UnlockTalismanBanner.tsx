import bannerImage from '@assets/unlock-spirit-key.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'

export const UnlockTalismanBanner = () => {
  const { t } = useTranslation('banners')
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('unlockTalisman.header')}</h1>
        <p>{t('unlockTalisman.description')}</p>
      </div>
      <div className="cta">
        <Button primary>{t('unlockTalisman.primaryCta')}</Button>
      </div>
    </Banner>
  )
}
