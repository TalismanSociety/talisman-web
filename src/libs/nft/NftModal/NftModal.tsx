import useNftAsset from '../useNftAsset/useNftAsset';
import { device } from '@util/breakpoints'
import NftPreview from '../NftPreview/NftPreview';
import { Button, useModal } from '@components'
import { useTranslation } from 'react-i18next';

import styled from 'styled-components'

const NftMainDetails = styled(({ details, className }) => {
    return (
        <div className={className}>
            <h1>I couldn't think of a collection name to test length.</h1>
            <p className='nft-main-val'>{details}</p>
        </div>
    ) 
})`
grid-area: nft-main-details;
overflow: hidden;
text-overflow: ellipsis;
`

const NftEdition = styled(({ editionData, className }) => {
    const { t } = useTranslation('nft-viewer');
    return (
        <div className={className}>
            <h1>{t('Edition')}</h1>
            <p className='nft-main-val'>#0053<span className='nft-sub-val'> / 1000</span></p>
        </div>        
    )
})`grid-area: nft-edition;`


const NftFloorPrice = styled(({ price, className }) => {
    const { t } = useTranslation('nft-viewer');
    return (
        <div className={className}>
            <h1>{t('Floor Price')}</h1>
            <p className='nft-main-val'>{price}</p>
        </div>        
    )
})`grid-area: nft-floor-price;`

const NftDescription = styled(({ description, className }) => {
    return (
        <div className={className}>
            <p className='nft-desc-value'>{description}</p>
        </div>        
    )
})`
grid-area: nft-description;
overflow: hidden;

.nft-desc-value {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
}
`

const NftAttributes = styled(({ properties, className }) => {
    const { t } = useTranslation('nft-viewer');
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
grid-area: nft-attributes;
margin-top: 10px;

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
grid-area: nft-network;

> p {
    font-size: 16px;
    color: var(--color-light);
    font-weight: 400;
}
`

const NftInformation = styled(({ className, nftData }) => {

    const { t } = useTranslation('nft-viewer');

    // Multiple components.

    return (
        <div className={className}>
            <NftMainDetails details={nftData?.name} />
            <NftEdition editionData={""}/>
            <NftFloorPrice price={"0.05KSM"}/>
            <NftDescription description={nftData?.description} />
            <div className='nft-buttons'>
                {/* Will be moved to new components */}
                <a className="nft-modal-button">{t('Send NFT Button')}</a>
                <a href={nftData?.collectibleUrl} 
                    target="_blank" 
                    className="nft-modal-button"
                    rel="noreferrer"
                >{t('View Singular')}</a>
            </div>
            <NftAttributes properties={nftData?.properties}/>
            <NftNetwork network={"RMRK2"}/>
            <p></p>
        </div>
    )
})`
overflow: hidden;
display: grid;
grid-template-areas:
    "nft-main-details nft-main-details nft-main-details"
    "nft-floor-price nft-edition nft-edition"
    "nft-description nft-description nft-description"
    "nft-buttons nft-buttons nft-buttons"
    "nft-attributes nft-attributes nft-attributes"
    "nft-network nft-network nft-network";
grid-template-rows: auto;

@media ${device.sm}{ padding-left: 0; }
@media ${device.lg}{ padding-left: 3em; }

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
    margin: 0;
}

.nft-buttons {
    grid-area: nft-buttons;
    display:flex;
    justify-content: space-between;
}

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

export const NftModal = styled(({ className, nft }) => {
    const nftData = useNftAsset(nft);

    return (
        <div className={className}>
            <NftPreview nft={nft} />
            <NftInformation nftData={nftData}/>
        </div>
    )

})`
    display: grid;
    
    @media ${device.sm}{
        grid-template-columns: 1fr;
        width: 100%;

        .nft-modal-content {
            overflow: hidden;
            padding-left: 0;
        }
    }

    @media ${device.lg}{

        // grid-template-areas:
        //     "nft-modal-image-preview nft-modal-content";
        grid-template-columns: 1fr 1fr;
        width: 905px;
        max-height: 1500px;

    }
`