import { usePortfolioHasEmptyBags } from '@libs/portfolio'
import { buyNow } from '@util/fiatOnRamp'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const hasEmptyBags = usePortfolioHasEmptyBags()

  if (hasEmptyBags) return <EmptyBagsBanner onClick={buyNow} />
  return <ExploreCrowdloansBanner />
}
