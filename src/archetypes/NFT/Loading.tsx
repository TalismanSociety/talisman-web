import { NFTShort, NFTShortArray } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

import Card from './Card/Card'

const Loading = ({ className, isLoading }: any) => {
  const nfts: NFTShortArray = []

  for (let i = 0; i < 4; i++) {
    nfts.push({
      id: `x0${i}`,
      name: 'Placeholder NFT',
      thumb: '',
      type: 'loading',
      mediaUri: '',
      platform: 'No Platform',
    } as NFTShort)
  }

  console.log(nfts)

  return (
    <div className={className}>
      {nfts.map((nft: any) => (
        <Card key={nft.id} nft={nft} />
      ))}
      {/* Fetching NFTs from the Paraverse... */}
    </div>
  )
}

const StyledLoading = styled(Loading)`
  display: grid;
  // filter: blur(4px);
  gap: 2rem;
  grid-template-columns: 1fr;

  span > .title,
  span > .subtitle {
    color: transparent !important;
    background-color: var(--color-dim);
    border-radius: 0.5rem;
  }

  span > .title {
    padding-top: 0 !important;
    margin-top: 0.5rem;
    width: 80% !important;
  }

  span > .subtitle {
    width: 50% !important;
  }

  @media ${device.md} {
    grid-template-columns: repeat(2, 1fr);
    > div:nth-last-child(-n + 2) {
      display: none;
    }
  }
  @media ${device.lg} {
    grid-template-columns: repeat(3, 1fr);
    > div:nth-last-child(-n + 1) {
      display: block;
    }
  }
  @media ${device.xl} {
    grid-template-columns: repeat(4, 1fr);
    > div:nth-last-child(n) {
      display: block;
    }
  }

  pointer-events: none;
`

export default StyledLoading
