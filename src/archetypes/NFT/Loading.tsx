import Button from '@components/Button'
import styled from '@emotion/styled'
import { NFTShort, NFTShortArray } from '@libs/@talisman-nft/types'
import { device } from '@util/breakpoints'

import Card from './Card/Card'

const Loading = ({ className, title, subtitle, button, isLoading }: any) => {
  const nfts: NFTShortArray = []

  for (let i = 0; i < 4; i++) {
    nfts.push({
      id: `x0${i}`,
      name: 'Placeholder NFT',
      thumb: '',
      type: isLoading ? 'loading' : 'blank',
      mediaUri: '',
      platform: 'No Platform',
      collection: {
        id: '',
        name: 'Collection',
      },
    } as NFTShort)
  }

  const hasHeader = !!title || !!subtitle || !!button

  return (
    <section className={className}>
      {!!hasHeader && (
        <header>
          {!!title && <div className="title">{title}</div>}
          {!!subtitle && <div className="subtitle">{title}</div>}
          {!!button && (
            <div className="cta">
              <a href={button.href} target="_blank" rel="noopener noreferrer">
                <Button className="outlined">{button.text}</Button>
              </a>
            </div>
          )}
        </header>
      )}
      <article data-blur={hasHeader}>
        {nfts.map((nft: any) => (
          <Card key={nft.id} nft={nft} />
        ))}
      </article>
    </section>
  )
}

const StyledLoading = styled(Loading)`
  > header {
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    color: white;
    font-style: bold;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  > article {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    pointer-events: none;

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

    span {
      .title,
      .subtitle {
        color: transparent !important;
        background-color: var(--color-dim);
        border-radius: 0.5rem;
      }
      .title {
        padding-top: 0 !important;
        margin-top: 0.5rem;
        width: 80% !important;
      }
      .subtitle {
        width: 50% !important;
      }
    }

    &[data-blur='true'] {
      filter: blur(4px);
    }
  }
`

export default StyledLoading
