import { useActiveAccount, useBalances } from '@libs/talisman'
import { buyNow } from '@util/fiatOnRamp'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'
import { NoWalletBanner } from './NoWalletBanner'

export const StateBanner = () => {
  const { status, address } = useActiveAccount()
  const { assetsValue, balances } = useBalances()

  let hasEmptyBags = false

  if (!address) hasEmptyBags = assetsValue === '0.00'
  else hasEmptyBags = balances?.find({ address: address })?.sum?.fiat('usd').transferable === 0

  if (status === 'UNAVAILABLE') {
    return <NoWalletBanner />
  }

  if (hasEmptyBags) return <EmptyBagsBanner onClick={buyNow} />
  return <ExploreCrowdloansBanner />
}
