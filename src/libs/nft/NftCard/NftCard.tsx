import { NftElement } from '../../types';
import { useModal } from '@components'
import Card from '../Card/Card';
import NftContentType from '../NftContentType/NftContentType';
import NftDescription from '../NftDescription/NftDescription';
import NftPreview from '../NftPreview/NftPreview';
import useNftAsset from '../useNftAsset/useNftAsset';
import {NftModal } from '../NftModal/NftModal';
import styles from './NftCard.module.css';

const RenderCard = (props: NftElement) => {
  const { nft } = props;
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
  );
};

export function NftCard(props: NftElement) {
  const { nft } = props;
  const { openModal } = useModal();
  const { collectibleUrl } = useNftAsset(nft);
  if (!nft) {
    return <RenderCard {...props} />;
  }
  return (
    <a
      // href={collectibleUrl}
      onClick={() => openModal(<NftModal nft={nft} />)}
      className={styles['nft-link']}
      target="_blank"
      rel="noreferrer noopener"
    >
      <RenderCard {...props} />
    </a>
  );
}

export default NftCard;


