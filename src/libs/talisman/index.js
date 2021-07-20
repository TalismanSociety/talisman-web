import Guardian from './guardian.tsx'
import Account from './account.tsx'
import Parachain from './parachain.tsx'
import Crowdloan from './crowdloan.tsx'
import Api from './api.tsx'
import Subquery from './subquery'
import Settings from './settings.tsx'
import { useChainByGenesis as _useChainByGenesis } from './util/hooks.tsx'


/* publically exposed hooks */

// polkadot guardian
export const useGuardian = Guardian.useGuardian
export const useGuardianValue = Guardian.useGuardianValue

// account things
export const useAccount = Account.useAccount

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
const Provider = ({children}) => 
	<Settings.Provider>
		<Api.Provider>
			<Subquery.Provider
				uri='https://api.subquery.network/sq/subvis-io/kusama-auction'
				>
				<Guardian.Provider>
					<Account.Provider>
						<Parachain.Provider>
							<Crowdloan.Provider>
								{children}
							</Crowdloan.Provider>
						</Parachain.Provider>
					</Account.Provider>
				</Guardian.Provider>
			</Subquery.Provider>
		</Api.Provider>
	</Settings.Provider>

export default Provider
