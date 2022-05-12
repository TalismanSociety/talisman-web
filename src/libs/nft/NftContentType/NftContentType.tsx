import { NftElement } from '../../../util/nfts/types'
import useNftAsset from '../useNftAsset/useNftAsset'
import styles from './NftContentType.module.css'
// import { ReactComponent as PlayCircleIcon } from './play-circle.svg'
// Icons Import
import { ReactComponent as NFTAudioIcon } from '@assets/icons/NFT-Audio-icon.svg'
import { ReactComponent as NFT3DIcon } from '@assets/icons/NFT-3D-icon.svg'
import { ReactComponent as NFTVideoIcon } from '@assets/icons/NFT-Video-icon.svg'
import { ReactComponent as NFTPDFIcon } from '@assets/icons/NFT-PDF-icon.svg'


export type NftContentTypes = 'audio' | 'video' | 'image'

export function NftContentType(props: NftElement) {
  const { nft } = props
  const { contentCategory: type } = useNftAsset(nft)
  switch (type) {
    case 'audio':
      return <NFTAudioIcon className={styles['nft-content-type-root']} />
    case 'video':
      return <NFTVideoIcon className={styles['nft-content-type-root']} />
    case 'model':
      return <NFT3DIcon className={styles['nft-content-type-root']} />
    case 'application':
      return <NFTPDFIcon className={styles['nft-content-type-root']} />
    default:
      return null
  }
}

export default NftContentType
