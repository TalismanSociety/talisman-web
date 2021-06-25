import Guardian from './guardian.tsx'
import Account from './account.tsx'
import Crowdloans from './crowdloans.tsx'
import Api from './api.tsx'
import Settings from './settings.tsx'


/* publically exposed hooks */

// polkadot guardian
export const useGuardian = Guardian.useGuardian
export const useGuardianValue = Guardian.useGuardianValue

// account things
export const useAccount = Account.useAccount;

// crowdloans stuff
export const useCrowdloans = Crowdloans.useCrowdloans
export const useCrowdloan = Crowdloans.useCrowdloan
export const useCrowdloanBySlug = Crowdloans.useCrowdloanBySlug
export const useCrowdloanFilter = Crowdloans.useCrowdloanFilter

// api wrap
export const useApi = Api.useApi

// setting bits
export const useSettings = Settings.useSettings



/* publically exposed provider */
const Provider = ({children}) => 
	<Settings.Provider>
		<Api.Provider>
			<Guardian.Provider>
				<Account.Provider>
					<Crowdloans.Provider>
						{children}
					</Crowdloans.Provider>
				</Account.Provider>
			</Guardian.Provider>
		</Api.Provider>
	</Settings.Provider>

export default Provider
