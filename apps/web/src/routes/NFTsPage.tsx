import { NFT } from '@archetypes'
import styled from '@emotion/styled'
import { device } from '@util/breakpoints'

const NFTsPage = styled(() => {
  return (
    <article>
      <NFT.List />
    </article>
  )
})`
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;
  > header + article {
    margin-top: 3rem;
  }
`

export default NFTsPage
