import { NftCard, useNftsByAddress } from '@talisman-connect/nft'
import { Key } from 'react'

interface NFTsByAddressProps {
  address: string
}

const NFTsByAddress = ({ address }: NFTsByAddressProps) => {
  const { nfts, isLoading } = useNftsByAddress(address as string)
  if (isLoading) {
    return null
  }
  return nfts?.map((nft: { id: Key | null | undefined }) => {
    return <NftCard key={nft.id} nft={nft} />
  })
}

export default NFTsByAddress
