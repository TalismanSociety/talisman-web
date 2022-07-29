

import { device } from '@util/breakpoints'
import styled from 'styled-components'


const NFTs = styled(({ className }: { className?: string }) => {
  // const { accounts } = useExtensionAutoConnect()
  // const { hasNfts, nfts } = useHasNFTs(accounts, { limit: 4 })
  return (
    <section className={`wallet-assets ${className}`}>

    </section>
  )
})`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .view-all {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .nft-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;

    @media ${device.md} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media ${device.lg} {
      grid-template-columns: repeat(3, 1fr);
    }

    @media ${device.xl} {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  h1 {
    display: flex;
    align-items: baseline;
    margin-bottom: 0.8em;
    font-size: var(--font-size-large);
    font-weight: bold;
    color: var(--color-text);
  }

  .nft-grid {
    svg {
      width: 4.8rem;
      height: 4rem;
    }

    @media ${device.lg} {
      svg {
        width: 4.5rem;
        height: 4rem;
      }
    }
  }
`

export default NFTs
