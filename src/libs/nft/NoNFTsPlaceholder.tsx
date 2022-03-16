import nftRowSkeleton from '@assets/nft-row-skeleton.png'
import { Button } from '@components'
import { Placeholder } from '@components/Placeholder'
import { TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'
import { useTranslation } from 'react-i18next'

export const NoNFTsPlaceholder = () => {
  const { t } = useTranslation('banners')
  return (
    <Placeholder placeholderImage={nftRowSkeleton}>
      <div className="description">{t('noNfts.description')}</div>
      <div className="cta">
        <a href={TALISMAN_SPIRIT_KEYS_RMRK} target="_blank" rel="noopener noreferrer">
          <Button className="outlined">{t('noNfts.primaryCta')}</Button>
        </a>
      </div>
    </Placeholder>
  )
}
