import { useActiveAccount, useBalances } from '@libs/talisman'
import { buyNow } from '@util/fiatOnRamp'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'
import { NoWalletBanner } from './NoWalletBanner'

export const StateBanner = () => {
  const { status, address } = useActiveAccount()
  const { assetsValue, balances } = useBalances()

  const hasEmptyBags =
    address !== undefined
      ? balances?.find({ address: address })?.sum?.fiat('usd').transferable === 0
      : assetsValue === '0.00'

  if (status === 'UNAVAILABLE') {
    return <NoWalletBanner />
  }

  if (hasEmptyBags) return <EmptyBagsBanner onClick={buyNow} />
  return <ExploreCrowdloansBanner />
}
