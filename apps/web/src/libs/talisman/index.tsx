import { PropsWithChildren } from 'react'

import * as Balance from './balances'
import * as Chainmeta from './chainmeta'
import * as Crowdloan from './crowdloan'
import * as Extension from './extension'
import * as Parachain from './parachain'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks'

/* publically exposed hooks */

// // balances stuff
export { useBalances } from './balances'
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
// // extension things
export { DAPP_NAME, useExtension, useExtensionAutoConnect } from './extension'
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
  <Extension.Provider>
    <Chainmeta.Provider>
      <Balance.Provider>
        <Parachain.Provider>
          <Crowdloan.Provider>{children}</Crowdloan.Provider>
        </Parachain.Provider>
      </Balance.Provider>
    </Chainmeta.Provider>
  </Extension.Provider>
)

export default Provider
