import Guardian from './guardian.tsx'
import Account from './account.tsx'


/* expose all public hooks */

// polkadot detector
export const useGuardian = Guardian.useGuardian

// account
export const useAccount = Account.useAccount;



/* expose the public provider */

// context types
type ProviderProps = {
	children?: React.ReactNode
}

// export the context as default
const Provider = ({children}: ProviderProps) => 
	<Guardian.Provider>
		<Account.Provider>
			{children}
		</Account.Provider>
	</Guardian.Provider>


export default Provider