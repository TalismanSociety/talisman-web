import { usePortfolioHasEmptyBags } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const hasEmptyBags = usePortfolioHasEmptyBags()

  if (hasEmptyBags) return <EmptyBagsBanner />
  return <ExploreCrowdloansBanner />
}
