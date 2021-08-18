import Account from './account'
import Api from './api'
import Crowdloan from './crowdloan'
import Guardian from './guardian'
import Parachain from './parachain'
import Settings from './settings'
import Subquery from './subquery'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks'

/* publically exposed hooks */

// polkadot guardian
export const useGuardian = Guardian.useGuardian
export const useGuardianValue = Guardian.useGuardianValue

// account things
export const useActiveAccount = Account.useActiveAccount
export const useAccountAddresses = Account.useAccountAddresses

// parachain things
export const useParachains = Parachain.useParachains
export const useParachainById = Parachain.useParachainById
export const useParachainBySlug = Parachain.useParachainBySlug
export const useParachainAssets = Parachain.useParachainAssets

// crowdloans stuff
export const useCrowdloans = Crowdloan.useCrowdloans
export const useCrowdloanByParachainId = Crowdloan.useCrowdloanByParachainId
export const useCrowdloanByParachainSlug = Crowdloan.useCrowdloanByParachainSlug
export const useCrowdloanAggregateStats = Crowdloan.useCrowdloanAggregateStats

// api wrap
export const useApi = Api.useApi

// subquery pieces
export const useQuery = Subquery.useQuery
export const gql = Subquery.gql

// setting bits
export const useSettings = Settings.useSettings

// helpers
export const useChainByGenesis = _useChainByGenesis

/* publically exposed provider */
const Provider = ({ children }) => (
  <Settings.Provider>
    <Api.Provider>
      <Subquery.Provider uri="https://api.subquery.network/sq/subvis-io/kusama-auction">
        <Guardian.Provider>
          <Account.Provider>
            <Parachain.Provider>
              <Crowdloan.Provider>{children}</Crowdloan.Provider>
            </Parachain.Provider>
          </Account.Provider>
        </Guardian.Provider>
      </Subquery.Provider>
    </Api.Provider>
  </Settings.Provider>
)

export default Provider
