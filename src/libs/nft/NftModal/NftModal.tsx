import useNftAsset from '../useNftAsset/useNftAsset';
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next';

import styled from 'styled-components'
import NftFullView from '../NftFullView/NftFullView';

const NftMainDetails = styled(({ nftId, collection, name, className }) => {
    return (
        <div className={className}>
            <p className='nft-main-val'>{name}</p>
            <h1># {NftGetEdition(nftId)}</h1>
        </div>
    ) 
})`
margin-bottom: 1em;
`

const NftGetEdition = (nftId : string) : number => {

    let newString = parseInt(nftId.split('-')[4].replace(/^0+/, ''))
    return newString
}

const NftEdition = styled(({ editionData, className }) => {
    const { t } = useTranslation('nft-viewer');
    return (
        <div className={className}>
            <h1>{t('Edition')}</h1>
            <p className='nft-main-val'>#0053<span className='nft-sub-val'> / 1000</span></p>
        </div>        
    )
})``


const NftFloorPrice = styled(({ price, className }) => {
    const { t } = useTranslation('nft-viewer');
    return (
        <div className={className}>
            <h1>{t('Floor Price')}</h1>
            <p className='nft-main-val'>{price}</p>
        </div>        
    )
})``

const NftDescription = styled(({ description, className }) => {
    return (
        <div className={className}>
            <p className='nft-desc-value'>
                {description}
                </p>
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

const NftAttributes = styled(({ properties, className }) => {
    const { t } = useTranslation('nft-viewer');

    if(Object.keys(properties).length == 0) return null;

    return (
        <div className={className}>
            <h1>{t('Attributes')}</h1>
            <div className='attribute-grid'>
            {Object.keys(properties).map((k) => 
                <div className='nft-attribute' key={k}>
                    <p className='nft-attribute-header'>{k}</p>
                    <p className='nft-attribute-value'>{properties[k].value}</p>
                </div>
            )}
            </div>
        </div>        
    )
})`
margin-bottom: 1em;
max-height: 150px;

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
    flex: 1;
    padding: 5px 8px;
    border-radius: 8px;
}

.nft-attribute-header { font-size: 12px; }

.nft-attribute-value {
    color: var(--color-light);
    font-size: 16px;
}
`

const NftNetwork = styled(({ network, className }) => {
    const { t } = useTranslation('nft-viewer');
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

const NftButtons = styled(({ collectibleUrl, className }) => {
    const { t } = useTranslation('nft-viewer');
    return (
        <div className={className}>
            <a href={collectibleUrl} 
                target="_blank" 
                className="nft-modal-button"
                rel="noreferrer"
            >{t('View Singular')}</a>
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

const NftInformation = styled(({ className, nftData }) => {

    const { t } = useTranslation('nft-viewer');

    return (
        <div className={className}>
            <NftMainDetails name={nftData?.name} collection={nftData?.collection} nftId={nftData?.id}/>
            {/* <NftEdition editionData={""}/> */}
            {/* <NftFloorPrice price={"0.05KSM"}/> */}
            <NftDescription description={nftData?.description} />
            <NftAttributes properties={nftData?.properties}/>
            {/* <NftNetwork network={"RMRK2"}/> */}
            <NftButtons collectibleUrl={nftData?.collectibleUrl}/>
        </div>
    )
})`
display: flex;
flex-direction: column;
// justify-content: space-between;

overflow-y: auto;
// overflow-x: hidden;
max-height: 458px;

@media ${device.sm}{ margin-left: 0; margin-top: 1em; }
@media ${device.lg}{ margin-left: 3em; margin-top: 0;}

div:last-of-type {
    margin-top: auto;
}

p {  margin-bottom: 0; }

.nft-main-val { 
    font-size: 1.5em; 
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

export const NftModal = styled(({ className, nft }) => {
    const nftData = useNftAsset(nft);

    return (
        <div className={className}>
            <NftFullView nft={nft} />
            <NftInformation nftData={nftData}/>
        </div>
    )

})`
    display: grid;
    
    @media ${device.sm}{
        grid-template-columns: 1fr;
        width: 100%;
    }

    @media ${device.lg}{
        grid-template-columns: 1fr 1fr;
        width: 905px;
        max-height: 1500px;
    }
`