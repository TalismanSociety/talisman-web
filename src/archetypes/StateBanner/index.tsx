import { usePortfolio } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const { totalUsd } = usePortfolio()
  if (+totalUsd > 0) {
    return <ExploreCrowdloansBanner />
  }
  return <EmptyBagsBanner />
}
