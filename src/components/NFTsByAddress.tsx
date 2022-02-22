import { NftCard, useNftsByAddress } from '@talisman-connect/nft'
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
}

const NFTsByAddress = ({ address }: NFTsByAddressProps) => {
  const { nfts, isLoading } = useNftsByAddress(address as string)
  if (isLoading) {
    return <Loading />
  }
  if (!nfts) {
    return null
  }
  return nfts?.map((nft: { id: Key | null | undefined }) => {
    return <NftCard key={nft.id} nft={nft} />
  })
}

export default NFTsByAddress
