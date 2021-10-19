import { device } from '@util/breakpoints'
import styled from 'styled-components'

interface BannerProps {
  backgroundImage: string
}

export const Banner = styled.div<BannerProps>`
  height: auto;
  padding: 3rem;
  border-radius: 1.6rem;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${props => props.backgroundImage}');
  background-size: cover;
  color: var(--color-text);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;

  > .description {
    flex: 1 0 70%;
  }

  > .cta {
    flex: 0 0 20%;
  }
`
