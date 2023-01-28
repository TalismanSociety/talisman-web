import styled from '@emotion/styled'
import { BuyBanner } from '@layout/StateBanner/BuyBanner'
import { device } from '@util/breakpoints'

const Buy = styled(({ className }: { className?: string }) => {
  return (
    <section className={className}>
      <BuyBanner onClick={() => window.open('https://talisman.banxa.com/', '_blank', 'noopener,noreferrer')} />
    </section>
  )
})`
  padding: 0 6vw;
  margin: 6rem auto;

  > * {
    margin-bottom: 3.25vw;
  }

  > header {
    > * + * {
      margin-top: 1rem;
    }
    @media ${device.xl} {
      display: flex;
      gap: 2rem;
      > * + * {
        margin-top: 0;
      }
    }
  }
`

export default Buy
