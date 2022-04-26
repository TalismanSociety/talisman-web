import { ReactComponent as PlayCircleIcon } from './play-circle.svg';
import styles from './NftContentType.module.css';
import { NftElement } from '../../../util/nfts/types';
import useNftAsset from '../useNftAsset/useNftAsset';

export type NftContentTypes = 'audio' | 'video' | 'image';

export function NftContentType(props: NftElement) {
  const { nft } = props;
  const { contentCategory: type } = useNftAsset(nft);
  switch (type) {
    case 'audio':
      return <PlayCircleIcon className={styles['nft-content-type-root']} />;
    case 'video':
      return <PlayCircleIcon className={styles['nft-content-type-root']} />;
    default:
      return null;
  }
}

export default NftContentType;
