import { Account } from '@libs/talisman'

import { UseNftsOptions, useNfts } from '../nft/useNfts/useNfts'

export function useHasNFTs(accounts: Account[], options?: UseNftsOptions) {
  const addresses = accounts.map(account => account.address)
  const { nfts, isLoading, ...rest } = useNfts(addresses, { limitPerAddress: 1, ...options })
  return {
    hasNfts: nfts && nfts?.length > 0 && !isLoading,
    isLoading,
    nfts,
    ...rest,
  }
}
