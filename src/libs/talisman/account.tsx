import { 
	createContext, 
	useContext,
	useState,
	useEffect
} from 'react'
import { findIndex } from 'lodash'
import { useGuardian } from '@libs/talisman'


const Context = createContext({});

const useAccount = () => useContext(Context)

const Provider = ({children}) => {
	
	const {
		accounts
	} = useGuardian()

	const [account, setAccount] = useState()
	const [balance, setBalance] = useState({})

	// set initial account if none selected
	useEffect(() => {
		if(!account && accounts.length > 0){
			updateAccount(accounts[0])
		}
	}, [accounts.length, account]) // eslint-disable-line

	// handle account switching
	let switchAccount = address => {
		const i = findIndex(accounts, {address: address})
		i>=0 && updateAccount(accounts[i])
	}

	// fetch related account information
	const updateAccount = account => {
		setAccount({
			address: account.address,
			name: account.meta.name
		})

		// [TODO] fetch balance
		const total = Math.floor(Math.random() * 20) + 1
		const reserve = 1
		const available = total - reserve
		setBalance({
			total,
			reserve,
			available
		})
	}

	return <Context.Provider 
		value={{
			...account,
			balance,
			switchAccount
		}}
		>
		{children}
	</Context.Provider>
}

const _account = {
	Provider,
	useAccount
}

export default _account