import NFT3DIcon from '@assets/icons/NFT-3D-icon.svg'
// import { ReactComponent as PlayCircleIcon } from './play-circle.svg'
// Icons Import
import NFTAudioIcon from '@assets/icons/NFT-Audio-icon.svg'
import NFTPDFIcon from '@assets/icons/NFT-PDF-icon.svg'
import NFTVideoIcon from '@assets/icons/NFT-Video-icon.svg'

import { NftElement } from '../../../util/nfts/types'
import useNftAsset from '../useNftAsset/useNftAsset'
import styles from './NftContentType.module.css'

export type NftContentTypes = 'audio' | 'video' | 'image' | 'application' | 'model'

export function NftContentType(props: NftElement) {
  const { nft } = props
  const { contentCategory: type } = useNftAsset(nft)
  switch (type) {
    case 'audio':
      return <img src={NFTAudioIcon} className={styles['nft-content-type-root']} title="Audio" alt="Audio NFT" />
    case 'video':
      return <img src={NFTVideoIcon} className={styles['nft-content-type-root']} title="Video" alt="Video NFT" />
    case 'model':
      return <img src={NFT3DIcon} className={styles['nft-content-type-root']} title="3D Model" alt="3D NFT" />
    case 'application':
      return (
        <img src={NFTPDFIcon} className={styles['nft-content-type-root']} title="PDF / Application" alt="PDF NFT" />
      )
    default:
      return null
  }
}

export default NftContentType
