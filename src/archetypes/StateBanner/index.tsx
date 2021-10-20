import { usePortfolio } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const { hasEmptyBags } = usePortfolio()

  if (hasEmptyBags) return <EmptyBagsBanner />
  return <ExploreCrowdloansBanner />
}
