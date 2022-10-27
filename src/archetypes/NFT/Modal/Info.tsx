import styled from '@emotion/styled'
import { ReactComponent as Composable } from '@icons/composable.svg'
import { NFTDetail } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'

export const MainDetails = styled(({ name, collection, composable, className }) => {
  return (
    <div className={className}>
      <h1>{collection}</h1>
      <p className="nft-main-val">
        {name} {!!composable && <Composable className="composable" title="Composable" />}
      </p>
    </div>
  )
})`
  margin-bottom: 1em;

  .composable {
    padding-top: 0.2em;
  }
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
        <span className="nft-sub-val"> / {editionData || '...'}</span>
      </p>
    </div>
  )
})`
  margin-top: 0 !important;
  width: 55%;
`

export const FloorPrice = styled(({ price, className }) => {
  const { t } = useTranslation('nft-viewer')
  return (
    <div className={className}>
      <h1>{t('Floor Price')}</h1>
      <div className="price-div">
        <span className="nft-main-val">{price || '...'} KSM</span>
      </div>
    </div>
  )
})`
  margin-top: 0 !important;
  width: 45%;
  overflow: hidden;

  .price-div {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const Expansion = styled(({ className }) => {
  return (
    <div className={className}>
      <span></span>
    </div>
  )
})`
  display: flex;
  margin-top: 0em !important;
  align-items: center;
  text-decoration: underline;

  > span {
    font-size: 1.25rem;
    padding: 0.25rem 0rem;
    border-radius: 1rem;
  }
`

export const Description = styled(({ description, className }) => {
  return (
    <div className={className}>
      <input type="checkbox" id="expand" />
      <div className="medium-12 small-12 columns smalldesc" id="desc-box">
        <p className="nft-desc-value">{description || ''}</p>
        <p className="nft-desc-value"></p>
      </div>
      {description.length > 100 && (
        <label htmlFor="expand">
          <Expansion />
        </label>
      )}
    </div>
  )
})`
  margin-bottom: 1em;

  > h1 {
    margin-bottom: 0.5em !important;
  }

  .nft-desc-value {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    width: 90%;
    text-align: left;
    border-radius: 1rem;
    color: var(--color-light);
  }

  #expand {
    display: none;
  }

  #expand + .smalldesc {
    max-height: 48px;
    overflow: hidden;

    display: -webkit-box;
    line-height: 16px; /* fallback */
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
    word-break: break-word;

    text-overflow: ellipsis;
    transition: all 0.3s ease;
  }

  #expand:checked + .smalldesc {
    max-height: 100%;
    line-height: 100%; /* fallback */
    -webkit-line-clamp: none; /* number of lines to show */
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  #expand:checked {
  }

  label {
    cursor: pointer;
  }

  span::before {
    content: 'Read more' !important;
  }

  #expand:checked ~ label {
    span::before {
      content: 'Read less' !important;
    }
  }

  label:hover {
    text-decoration: none;
    color: var(--color-light);
  }
`

export const Attributes = styled(({ properties, className }) => {
  if (properties === undefined || Object.keys(properties).length === 0) return null

  return (
    <div className={className}>
      {/* <h1>{t('Attributes')}</h1> */}
      <div className="attribute-grid">
        {properties['Migrated from'] ? (
          <div className="nft-attribute">
            <p className="nft-attribute-header">Migrated NFT</p>
          </div>
        ) : (
          Object.keys(properties).map(k => (
            <div className="nft-attribute" key={k}>
              <p className="nft-attribute-header">{k.replace('_', ' ').toUpperCase()}</p>
              <p className="nft-attribute-value">{properties[k].value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
})`
  margin-bottom: 1em;

  h1 + .attribute-grid {
    margin-top: 0.5em !important;
  }

  .attribute-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    gap: 7px;
    margin-top: 5px;
  }

  .nft-attribute {
    background-color: #262626;
    width: fit-content;
    padding: 5px 8px;
    border-radius: 8px;
  }

  .nft-attribute-header {
    font-size: 12px;
  }

  .nft-attribute-value {
    color: var(--color-light);
    font-size: 14px;
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

export const Buttons = styled(({ collectibleUrl, platform, className }) => {
  return (
    <div className={className}>
      <a href={collectibleUrl} target="_blank" className="nft-modal-button" rel="noreferrer">
        <span>View On {platform}</span>
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

const LoadingState = ({ className }: any) => {
  return (
    <div className={className}>
      <span className="title" />
      <span className="description" />
      <span className="description" />
      <span className="description" />
      <span className="description" />
    </div>
  )
}

const StyledLoadingState: any = styled(LoadingState)`
  margin: 0 3em;
  display: flex;
  flex-direction: column;

  > span {
    font-size: 24px;
    border-radius: 0.5rem;
  }

  > .title,
  .description {
    background-color: var(--color-activeBackground);
    -webkit-mask: linear-gradient(-60deg, #000 30%, #0005, #000 70%) right/300% 100%;
    animation: shimmer 1s infinite;
  }

  @keyframes shimmer {
    100% {
      -webkit-mask-position: left;
    }
  }

  .title + .description {
    margin-top: 2em;
  }

  .description {
    margin-top: 1em;
    font-size: 16px;
    height: 1em;
  }

  .description:last-child {
    width: 40%;
  }

  .title {
    width: 70%;
    height: 1.25em;
  }
`

type InfoProps = {
  className?: string
  nft?: NFTDetail
  loading: boolean
}

const Info = ({ className, nft, loading }: InfoProps) => {
  if (loading) return <StyledLoadingState />

  return (
    <div className={className}>
      {!!nft && (
        <>
          <MainDetails
            name={nft?.name}
            collection={nft?.collection?.name || nft?.collection?.id}
            composable={nft?.nftSpecificData?.isComposable}
          />
          <CollectionData
            editionData={nft?.collection?.totalCount}
            nftId={nft?.serialNumber}
            price={nft?.collection?.floorPrice}
          />
          {!!nft?.description && <Description description={nft?.description} />}
          <Attributes properties={nft?.attributes} />
          <Network network={nft?.provider} />
          <Buttons collectibleUrl={nft?.platformUri} platform={nft?.provider} />
        </>
      )}
    </div>
  )
}

const StyledInfo = styled(Info)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 450px;

  scrollbar-gutter: stable;

  ::-webkit-scrollbar {
    width: 5px;
    border-radius: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: var(--color-controlBackground);
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: var(--color-dim);
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

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
    font-size: 22px;
    font-weight: 600;
    color: var(--color-light);
    letter-spacing: -0.04em;
  }

  .nft-sub-val {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-dim);
  }

  h1 {
    font-weight: 100;
    color: var(--color-mid);
    font-size: 12px;
    line-height: 16px;
    margin: 0;
  }
`

export default StyledInfo
