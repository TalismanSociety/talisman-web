import { Account } from '@libs/talisman'
import { useNfts } from '@talisman-components/nft'

export function useHasNFTs(accounts: Account[], options?: Record<string, unknown>) {
  const addresses = accounts.map(account => account.address)
  const { nfts, isLoading, ...rest } = useNfts(addresses, { limitPerAddress: 1, ...options })
  return {
    hasNfts: nfts && nfts?.length > 0 && !isLoading,
    isLoading,
    nfts,
    ...rest,
  }
}
