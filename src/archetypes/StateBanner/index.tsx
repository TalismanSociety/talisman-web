import { StyledLoader } from '@components/Await'
import ExtensionStateGate from '@components/ExtensionStatusGate'
import { usePortfolio } from '@libs/portfolio'

import { EmptyBagsBanner } from './EmptyBagsBanner'
import { ExploreCrowdloansBanner } from './ExploreCrowdloansBanner'
import { WalletNotConfiguredBanner } from './WalletNotConfigured'

export const StateBanner = () => {
  const { totalUsd } = usePortfolio()
  return (
    <ExtensionStateGate
      loading={<StyledLoader />}
      unavailable={<WalletNotConfiguredBanner />}
      noaccount={<WalletNotConfiguredBanner />}
      unauthorized={<WalletNotConfiguredBanner />}
    >
      {+totalUsd > 0 ? <ExploreCrowdloansBanner /> : <EmptyBagsBanner />}
    </ExtensionStateGate>
  )
}
