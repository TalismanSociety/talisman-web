import { device } from "@util/breakpoints"

import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { NFTItem } from "@libs/@talisman-nft/types"

export const MainDetails = styled(({ nftId, collection, name, className }) => {
  return (
    <div className={className}>
      <p className="nft-main-val">{name}</p>
    </div>
  )
})`
  margin-bottom: 1em;
`

export const CollectionData = styled(({ editionData, nftId, price, className }) => {
  return (
    <div className={className}>
      <Edition editionData={editionData} nftId={nftId} />
      <FloorPrice price={price} />
    </div>
  )
})`
  display: flex;
  justify-content: space-between;
  min-height: 70px;
`

export const Edition = styled(({ editionData, nftId, className }) => {
  const { t } = useTranslation('nft-viewer')
  return (
    <div className={className}>
      <h1>{t('Edition')}</h1>
      <p className="nft-main-val">
        # {nftId}
        <span className="nft-sub-val"> / {editionData || "..."}</span>
      </p>
    </div>
  )
})`
  width: 55%;
`

export const FloorPrice = styled(({ price, className }) => {
  const { t } = useTranslation('nft-viewer')
  return (
    <div className={className}>
      <h1>{t('Floor Price')}</h1>
      <p className="nft-main-val">{price || "..."} KSM</p>
    </div>
  )
})`
  margin-top: 0 !important;
  width: 45%;
`

export const Description = styled(({ description, className }) => {
  return (
    <div className={className}>
      <p className="nft-desc-value">{description || ""}</p>
    </div>
  )
})`
  margin-bottom: 1em;

  .nft-desc-value {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    width: 350px;
  }
`

export const Attributes = styled(({ properties, className }) => {
  
  const { t } = useTranslation('nft-viewer')
  if (properties === undefined || Object.keys(properties).length === 0) return null

  return (
    <div className={className}>
      <h1>{t('Attributes')}</h1>
      <div className="attribute-grid">
        {properties['Migrated from'] ? (
          <div className="nft-attribute">
            <p className="nft-attribute-header">Migrated NFT</p>
          </div>
        ) : (
          Object.keys(properties).map(k => (
            <div className="nft-attribute" key={k}>
              <p className="nft-attribute-header">{k}</p>
              <p className="nft-attribute-value">{properties[k].value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
})`
  margin-bottom: 1em;

  .attribute-grid {
    display: inline-box;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    gap: 7px;
    margin-top: 5px;
  }

  .nft-attribute {
    background-color: var(--color-dim);
    width: fit-content;
    padding: 5px 8px;
    border-radius: 8px;
  }

  .nft-attribute-header {
    font-size: 12px;
  }

  .nft-attribute-value {
    color: var(--color-light);
    font-size: 16px;
  }
`

export const Network = styled(({ network, className }) => {
  const { t } = useTranslation('nft-viewer')
  return (
    <div className={className}>
      <h1>{t('NFT Network')}</h1>
      <p>{network}</p>
    </div>
  )
})`
  > p {
    font-size: 16px;
    color: var(--color-light);
    font-weight: 400;
  }
`

export const Buttons = styled(({ collectibleUrl, className }) => {
  const { t } = useTranslation('nft-viewer')
  return (
    <div className={className}>
      <a href={collectibleUrl} target="_blank" className="nft-modal-button" rel="noreferrer">
        {t('View Singular')}
      </a>
    </div>
  )
})`
  grid-area: nft-buttons;
  display: flex;
  justify-content: space-between;
  min-height: 70px;

  .nft-modal-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    width: 49%;
    margin: 10px 0px;
    color: var(--color-foreground);
    border-radius: 1rem;
    border: solid 1px var(--color-dim);
    font-size: 16px;
    font-weight: 400;
  }
`

type InfoProps = {
  className?: string
  nft?: NFTItem
}

const Info = ({ className, nft } : InfoProps) => {


  return (
    <div className={className}>
      {!!nft && 
        <>
          <MainDetails name={nft?.name} collection={nft?.collection?.name} />
          <CollectionData
            editionData={nft?.collection?.totalCount}
            nftId={nft.serialNumber}
            price={nft?.collection?.floorPrice}
          />
          <Description description={nft?.description} />
          <Attributes properties={nft?.attributes} />
          <Network network={nft?.platform}/>
          <Buttons collectibleUrl={nft?.id} />
        </>
      }

    </div>
  )
}

const StyledInfo = styled(Info)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 458px;
  @media ${device.sm} {
    margin-left: 0;
    margin-top: 1em;
  }
  @media ${device.lg} {
    margin-left: 3em;
    margin-top: 0;
  }

  div:last-of-type {
    margin-top: auto;
  }

  p {
    margin-bottom: 0;
  }

  .nft-main-val {
    font-size: 1.4em;
    font-weight: 600;
    color: var(--color-light);
  }

  .nft-sub-val {
    font-weight: 600;
    color: var(--color-dim);
  }

  h1 {
    font-weight: 400;
    color: var(--color-mid);
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 10px;
  }
`

export default StyledInfo