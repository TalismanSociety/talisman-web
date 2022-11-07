// import { useNftsByAddress } from '@libs/@talisman-nft/useNftsByAddress'
// // import { NFTCard } from '@archetypes/NFT'
// import { NftCard } from '@libs/nft/NftCard/NftCard'
// import { device } from '@util/breakpoints'
// import styled from '@emotion/styled'

// import MaterialLoader from './MaterialLoader'

// const Loading = styled(MaterialLoader)`
//   font-size: 6.4rem;
//   margin: 4rem auto;
//   color: var(--color-primary);
//   user-select: none;
// `

// interface NFTsByAddressProps {
//   className?: string
//   address: string
//   limit?: number
// }

// const NFTsByAddress = styled(({ className = '', address, limit }: NFTsByAddressProps) => {
//   const { setAddress, nfts, loading } = useNftsByAddress(address as string)
//   if (loading) {
//     return <Loading />
//   }
//   if (!nfts) {
//     return null
//   }
//   const pickedNfts = limit ? nfts?.slice(0, limit) : nfts
//   return pickedNfts?.map((nft: any) => {
//     return (
//       <div key={nft.id} className={className}>
//         <NftCard nft={nft} />
//       </div>
//     )
//   })
// })`
//   svg {
//     width: 4.8rem;
//     height: 4rem;
//   }

//   @media ${device.lg} {
//     svg {
//       width: 4.5rem;
//       height: 4rem;
//     }
//   }
// `

// export default NFTsByAddress
