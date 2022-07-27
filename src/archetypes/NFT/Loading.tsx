import { NFTShortArray, NFTShort } from "@libs/@talisman-nft/types"
import { device } from "@util/breakpoints"
import styled from "styled-components"
import Card from "./Card/Card"

const Loading = ({ className, isLoading }: any) => {

  const nfts : NFTShortArray = []

  for (let i = 0; i < 4; i++) {
    nfts.push({
      id: `x0${i}`,
      name: "Placeholder NFT",
      thumb: "",
      type: isLoading ? "loading" : null,
      mediaUri: "",
      platform: "No Platform"
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
filter: grayscale(100%) blur(5px);
gap: 2rem;
grid-template-columns: 1fr;


@media ${device.md} {
  grid-template-columns: repeat(2, 1fr);
  > div:nth-last-child(-n+2) {
    display: none;
  }
}
@media ${device.lg} {
  grid-template-columns: repeat(3, 1fr);
  > div:nth-last-child(-n+1) {
    display: block;
  }
}
@media ${device.xl} {
  grid-template-columns: repeat(4, 1fr);
  > div:nth-last-child(n) {
    display: block;
  }
}

pointer-events: none

`

export default StyledLoading