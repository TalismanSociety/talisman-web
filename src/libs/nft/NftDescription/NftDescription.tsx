import { NftElement } from '../../../util/nfts/types'
import styles from './NftDescription.module.css'

export function NftDescription(props: NftElement) {
  const { nft } = props
  const placeholderStyles = (width: string) => (nft ? '' : `${styles['placeholder']} ${styles[width]}`)

  return (
    <div className={styles['nft-description-root']}>
      <div className={`${styles['description-title']} ${placeholderStyles('width-1/2')}`}>#{nft?.serialNumber} | {nft?.platform}</div>
      <div className={`${placeholderStyles('width-3/4')}`}>{nft?.name}</div>
    </div>
  )
}

export default NftDescription
