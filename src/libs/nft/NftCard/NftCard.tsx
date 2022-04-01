import { NftElement } from '../../types';
import Card from '../Card/Card';
import NftContentType from '../NftContentType/NftContentType';
import NftDescription from '../NftDescription/NftDescription';
import NftPreview from '../NftPreview/NftPreview';
import useNftAsset from '../useNftAsset/useNftAsset';
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
  const { collectibleUrl } = useNftAsset(nft);
  if (!nft) {
    return <RenderCard {...props} />;
  }
  return (
    <a
      href={collectibleUrl}
      className={styles['nft-link']}
      target="_blank"
      rel="noreferrer noopener"
    >
      <RenderCard {...props} />
    </a>
  );
}

export default NftCard;
