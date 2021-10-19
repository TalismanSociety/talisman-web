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
  width: 100%;
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
