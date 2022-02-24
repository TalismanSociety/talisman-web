import { NftCard, useNftsByAddress } from '@talisman-connect/nft'
import { encodeAnyAddress } from '@talismn/util'
import { Key } from 'react'
import styled from 'styled-components'

import MaterialLoader from './MaterialLoader'

const Loading = styled(MaterialLoader)`
  font-size: 6.4rem;
  margin: 4rem auto;
  color: var(--color-primary);
  user-select: none;
`

interface NFTsByAddressProps {
  address: string
  limit?: number
}

const NFTsByAddress = ({ address, limit }: NFTsByAddressProps) => {
  const encodedAddress = encodeAnyAddress(address, 2) // TODO: This should not be needed. Fix `useNftsByAddress` to accept eth address
  const { nfts, isLoading } = useNftsByAddress(encodedAddress as string)
  if (isLoading) {
    return <Loading />
  }
  if (!nfts) {
    return null
  }
  const pickedNfts = limit ? nfts?.slice(0, limit) : nfts
  return pickedNfts?.map((nft: { id: Key | null | undefined }) => {
    return <NftCard key={nft.id} nft={nft} />
  })
}

export default NFTsByAddress
