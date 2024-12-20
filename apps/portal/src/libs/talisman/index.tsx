import { BalancesProvider } from '@talismn/balances-react'
import { type PropsWithChildren } from 'react'

import * as Chainmeta from './chainmeta'
import * as Crowdloan from './crowdloan'
import * as Parachain from './parachain'

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

/* publically exposed provider */
const Provider = ({ children }: PropsWithChildren) => (
  <Chainmeta.Provider>
    <BalancesProvider
      onfinalityApiKey={import.meta.env.VITE_ONFINALITY_API_KEY ?? undefined}
      coingeckoApiUrl={import.meta.env.VITE_COIN_GECKO_API}
      coingeckoApiKeyValue={import.meta.env.VITE_COIN_GECKO_API_KEY}
      coingeckoApiKeyName={
        import.meta.env.VITE_COIN_GECKO_API_TIER === 'pro'
          ? 'x-cg-pro-api-key'
          : import.meta.env.VITE_COIN_GECKO_API_TIER === 'demo'
            ? 'x-cg-demo-api-key'
            : undefined
      }
    >
      <Parachain.Provider>
        <Crowdloan.Provider>{children}</Crowdloan.Provider>
      </Parachain.Provider>
    </BalancesProvider>
  </Chainmeta.Provider>
)

export default Provider
