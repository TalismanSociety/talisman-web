import { StyledLoader } from '@components/Await'
import ExtensionStateGate from '@components/ExtensionStatusGate'
import { usePortfolioHasEmptyBags } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const hasEmptyBags = usePortfolioHasEmptyBags()
  return (
    <ExtensionStateGate
      loading={<StyledLoader />}
      unavailable={<EmptyBagsBanner />}
      noaccount={<EmptyBagsBanner />}
      unauthorized={<EmptyBagsBanner />}
    >
      {hasEmptyBags ? <EmptyBagsBanner /> : <ExploreCrowdloansBanner />}
    </ExtensionStateGate>
  )
}
