import { useModal } from '@components'

import { NftElement } from '../../../util/nfts/types'
import Card from '../Card/Card'
import NftContentType from '../NftContentType/NftContentType'
import NftDescription from '../NftDescription/NftDescription'
import { NftModal } from '../NftModal/NftModal'
import NftPreview from '../NftPreview/NftPreview'
import styles from './NftCard.module.css'

const RenderCard = (props: NftElement) => {
  const { nft } = props
  return (
    <Card
      header={<NftPreview nft={nft} />}
      description={
        <div className={styles['nft-card-description']}>
          <NftDescription nft={nft} />
          <NftContentType nft={nft} />
        </div>
      }
    />
  )
}

export function NftCard(props: NftElement) {
  const { nft } = props
  const { openModal } = useModal()
  if (!nft) {
    return <RenderCard {...props} />
  }
  return (
    <div
      onClick={() => {
        openModal(<NftModal nft={nft} />)
      }}
      className={styles['nft-link']}
    >
      <RenderCard {...props} />
    </div>
  )
}

export default NftCard
