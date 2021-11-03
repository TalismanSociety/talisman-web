import { device } from '@util/breakpoints'
import styled from 'styled-components'

interface BannerProps {
  backgroundImage: string
}

export const Banner = styled.aside<BannerProps>`
  height: auto;
  padding: 2rem;
  @media ${device.xl} {
    padding: 3rem;
  }
  border-radius: 1.6rem;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${props => props.backgroundImage}');
  background-position: 50%;
  background-size: cover;
  color: var(--color-text);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;

  > .description {
    flex: 1 0 50%;

    h1 {
      font-size: var(--font-size-xlarge);
      font-weight: var(--font-weight-bold);
    }

    p {
      font-size: var(--font-size-small);
    }

    @media ${device.md} {
      h1 {
        font-size: var(--font-size-xxlarge);
      }
      p {
        font-size: var(--font-size-normal);
      }
    }
  }

  > .cta {
    flex: 0 0 20%;
    width: 100%;

    button {
      width: 100%;
    }
  }
`
