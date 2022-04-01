import { NftElement } from '../../types';
import useNftAsset from '../useNftAsset/useNftAsset';
import styles from './NftDescription.module.css';

export function NftDescription(props: NftElement) {
  const { nft } = props;
  const placeholderStyles = (width: string) =>
    nft ? '' : `${styles['placeholder']} ${styles[width]}`;
  const { name, collection } = useNftAsset(nft);

  return (
    <div className={styles['nft-description-root']}>
      <div
        className={`${styles['description-title']} ${placeholderStyles(
          'width-1/2'
        )}`}
      >
        {collection?.name}
      </div>
      <div className={`${placeholderStyles('width-3/4')}`}>{name}</div>
    </div>
  );
}

export default NftDescription;
