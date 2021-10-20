import { StyledLoader } from '@components/Await'
import ExtensionStateGate from '@components/ExtensionStatusGate'
import { usePortfolio } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'

export const StateBanner = () => {
  const { totalUsd } = usePortfolio()
  return (
    <ExtensionStateGate
      loading={<StyledLoader />}
      unavailable={<EmptyBagsBanner />}
      noaccount={<EmptyBagsBanner />}
      unauthorized={<EmptyBagsBanner />}
    >
      {+totalUsd > 0 ? <ExploreCrowdloansBanner /> : <EmptyBagsBanner />}
    </ExtensionStateGate>
  )
}
