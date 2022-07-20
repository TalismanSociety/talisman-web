// import { useModal } from '@components'
// import styled from 'styled-components'
// import Card from './Card'
// import { NftElement } from './types'

// import NftContentType from '@libs/nft/NftContentType/NftContentType'
// import NftDescription from '@libs/nft/NftDescription/NftDescription'
// import NftPreview from '@libs/nft/NftPreview/NftPreview'
// import { NftModal } from '@libs/nft/NftModal/NftModal'

// type NFTCardProps = {
//   className: string
//   props: NftElement
// }

// const RenderCard = (props: NftElement) => {
//   const { nft } = props
//   return (
//     <Card
//       header={<NftPreview nft={nft} />}
//       description={
//         <div className={styles['nft-card-description']}>
//           <NftDescription nft={nft} />
//           <NftContentType nft={nft} />
//         </div>
//       }
//     />
//   )
// }

// const NFTCard = ({className, props }: NFTCardProps) => {
//   const { nft } = props
//   const { openModal } = useModal()

//   if(!nft) return <RenderCard {...props} />

//   return 
//   (
//     <div
//       onClick={() => {
//         openModal(<NftModal nft={nft} />)
//       }}
//       className={styles['nft-link']}
//     >
//       <RenderCard {...props} />
//     </div>
//   )
// }

// const StyledNFTCard = styled(NFTCard)`

// `

// export default StyledNFTCard