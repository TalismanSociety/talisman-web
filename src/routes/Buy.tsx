import { ComingSoonBanner } from '@archetypes/StateBanner/ComingSoonBanner'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

const Buy = styled(({ className }) => {
  return (
    <section className={className}>
      <ComingSoonBanner />
    </section>
  )
})`
  margin: 0 auto;
  width: 100%;
  max-width: calc(92rem + 6vw);
  padding: 0 3vw;
  margin: 6rem auto;

  > * {
    margin-bottom: 3.25vw;
  }

  > header {
    > * + * {
      margin-top: 1rem;
    }
    @media ${device.lg} {
      display: flex;
      gap: 2rem;
      > * + * {
        margin-top: 0;
      }
    }
  }
`

export default Buy
