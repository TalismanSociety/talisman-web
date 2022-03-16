import { Account } from '@libs/talisman'
import { useNfts } from '@talisman-components/nft'

export function useHasNFTs(accounts: Account[]) {
  const addresses = accounts.map(account => account.address)
  const { nfts, isLoading, ...rest } = useNfts(addresses, { limitPerAddress: 1 })
  return {
    hasNfts: nfts && nfts?.length > 0 && !isLoading,
    isLoading,
    nfts,
    ...rest,
  }
}
