import { PropsWithChildren } from 'react'

import * as Account from './account'
import * as Balance from './balances'
import * as Chainmeta from './chainmeta'
import * as Crowdloan from './crowdloan'
import * as Extension from './extension'
import * as Parachain from './parachain'
import Subquery from './subquery'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks'

/* publically exposed hooks */

// account things
export { useAccountAddresses, useAccounts, useActiveAccount, useAllAccountAddresses } from './account'

// // chainmeta things
export { useChainmeta, useChainmetaValue } from './chainmeta'

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

// // crowdloans stuff
export {
  useCrowdloanAggregateStats,
  useCrowdloanById,
  useCrowdloanByParachainId,
  useCrowdloans,
  useCrowdloansByParachainId,
  useLatestCrowdloans,
} from './crowdloan'

// // balances stuff
export { useBalances } from './balances'

// subquery pieces
export const useQuery = Subquery.useQuery
export const gql = Subquery.gql

// helpers
export const useChainByGenesis = _useChainByGenesis

/* publically exposed provider */
const Provider = ({ children }: PropsWithChildren) => (
  <Subquery.Provider uri="https://api.subquery.network/sq/subvis-io/kusama-crowdloans-and-auctions-v2">
    <Extension.Provider>
      <Chainmeta.Provider>
        <Account.Provider>
          <Balance.Provider>
            <Parachain.Provider>
              <Crowdloan.Provider>{children}</Crowdloan.Provider>
            </Parachain.Provider>
          </Balance.Provider>
        </Account.Provider>
      </Chainmeta.Provider>
    </Extension.Provider>
  </Subquery.Provider>
)

export default Provider
