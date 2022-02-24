import { useAllAccountAddresses } from '@libs/talisman'

import NFTsByAddress from './NFTsByAddress'

const AllNFTs = () => {
  const addresses = useAllAccountAddresses()
  return (
    <>
      {addresses?.map(address => {
        return <NFTsByAddress key={address} address={address} limit={4} />
      })}
    </>
  )
}

export default AllNFTs
