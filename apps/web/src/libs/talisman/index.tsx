import { balanceModules } from '@talismn/balances-default-modules'
import { BalancesProvider } from '@talismn/balances-react'
import { type PropsWithChildren } from 'react'

import * as Chainmeta from './chainmeta'
import * as Crowdloan from './crowdloan'
import * as Parachain from './parachain'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks'

/* publically exposed hooks */

// // chainmeta things
export { useChainmeta, useChainmetaValue } from './chainmeta'
// // crowdloans stuff
export {
  useCrowdloanAggregateStats,
  useCrowdloanById,
  useCrowdloanByParachainId,
  useCrowdloans,
  useCrowdloansByParachainId,
  useLatestCrowdloans,
} from './crowdloan'
// // parachain things
export {
  useFindParachainDetails,
  useParachainAssets,
  useParachainDetailsById,
  useParachainDetailsBySlug,
  useParachainsDetails,
  useParachainsDetailsIndexedById,
} from './parachain'

// helpers
export const useChainByGenesis = _useChainByGenesis

/* publically exposed provider */
const Provider = ({ children }: PropsWithChildren) => (
  <Chainmeta.Provider>
    <BalancesProvider
      balanceModules={balanceModules}
      onfinalityApiKey={import.meta.env.REACT_APP_ONFINALITY_API_KEY ?? undefined}
    >
      <Parachain.Provider>
        <Crowdloan.Provider>{children}</Crowdloan.Provider>
      </Parachain.Provider>
    </BalancesProvider>
  </Chainmeta.Provider>
)

export default Provider
