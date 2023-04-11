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
  @media ${device.xl} {
    margin: 6rem auto;
  }
  > header + article {
    margin-top: 3rem;
  }
`

export default NFTsPage
