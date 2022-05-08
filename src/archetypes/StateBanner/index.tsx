import { usePortfolioHasEmptyBags } from '@libs/portfolio'
import { useActiveAccount } from '@libs/talisman'
import { buyNow } from '@util/fiatOnRamp'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'
import { NoWalletBanner } from './NoWalletBanner'

export const StateBanner = () => {
  const hasEmptyBags = usePortfolioHasEmptyBags()
  const { status } = useActiveAccount()
  if (status === 'UNAVAILABLE') {
    return <NoWalletBanner />
  }

  if (hasEmptyBags) return <EmptyBagsBanner onClick={buyNow} />
  return <ExploreCrowdloansBanner />
}
