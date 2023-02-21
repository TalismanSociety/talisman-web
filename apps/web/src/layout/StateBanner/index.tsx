import { useActiveAccount, useBalances } from '@libs/talisman'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'
import { NoWalletBanner } from './NoWalletBanner'

export const StateBanner = () => {
  const { status, address } = useActiveAccount()
  const { balances, assetsTransferable } = useBalances()

  const hasEmptyBags =
    address !== undefined
      ? balances?.find({ address: address })?.sum?.fiat('usd').transferable === 0
      : assetsTransferable === '0.00'

  if (status === 'UNAVAILABLE') {
    return <NoWalletBanner />
  }

  if (hasEmptyBags)
    return (
      <EmptyBagsBanner onClick={() => window.open('https://talisman.banxa.com/', '_blank', 'noopener,noreferrer')} />
    )
  return <ExploreCrowdloansBanner />
}
