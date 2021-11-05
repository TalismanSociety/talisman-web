import bannerImage from '@assets/unlock-spirit-key-pink.png'
import { Button } from '@components'
import { Banner } from '@components/Banner'
import { useTranslation } from 'react-i18next'

export const UnlockTalismanBanner = () => {
  const { t, ready } = useTranslation('banners')
  if (!ready) {
    return null
  }
  return (
    <Banner backgroundImage={bannerImage}>
      <div className="description">
        <h1>{t('unlockTalisman.header')}</h1>
        <p>{t('unlockTalisman.description')}</p>
      </div>
      <div className="cta">
        <a
          href="https://medium.com/we-are-talisman/seek-the-spirit-key-enter-the-talisman-b68d3541157b"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button primary>{t('unlockTalisman.primaryCta')}</Button>
        </a>
      </div>
    </Banner>
  )
}
