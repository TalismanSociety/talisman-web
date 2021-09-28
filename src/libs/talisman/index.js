import * as Account from './account'
import Api from './api'
import * as Chainmeta from './chainmeta'
import * as Crowdloan from './crowdloan'
import * as Extension from './extension'
import * as Parachain from './parachain'
import Settings from './settings'
import Subquery from './subquery'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks'

/* publically exposed hooks */

// account things
export * from './account'

// chainmeta things
export * from './chainmeta'

// extension things
export * from './extension'

// parachain things
export * from './parachain'

// crowdloans stuff
export * from './crowdloan'

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
      <Subquery.Provider uri="https://api.subquery.network/sq/TalismanSociety/kusama-crowdloans">
        <Extension.Provider>
          <Chainmeta.Provider>
            <Account.Provider>
              <Parachain.Provider>
                <Crowdloan.Provider>{children}</Crowdloan.Provider>
              </Parachain.Provider>
            </Account.Provider>
          </Chainmeta.Provider>
        </Extension.Provider>
      </Subquery.Provider>
    </Api.Provider>
  </Settings.Provider>
)

export default Provider
