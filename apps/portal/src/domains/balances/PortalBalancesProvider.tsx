import { BalancesProvider } from '@talismn/balances-react'
import { ReactNode } from 'react'

import { useStakingBalancesEnabledTokens } from '@/components/widgets/staking/providers/hooks/useProvidersData'

export const PortalBalancesProvider = ({ children }: { children?: ReactNode }) => (
  <BalancesProvider
    onfinalityApiKey={import.meta.env.VITE_ONFINALITY_API_KEY ?? undefined}
    // NOTE: Must be called inside of <RecoilRoot>
    // we filter the list of enable tokens to only those used by staking, thus improving the performance of the Portal
    enabledTokens={useStakingBalancesEnabledTokens()}
  >
    {children}
  </BalancesProvider>
)
