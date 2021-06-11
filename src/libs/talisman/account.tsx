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
		accounts,
		status,
		message
	} = useGuardian()

	const [
		activeAccountIndex, 
		setActiveAccountIndex
	] = useState(-1)

	// set initial active account if none selected
	useEffect(
		() => activeAccountIndex === -1 && accounts.length > 0 && setActiveAccountIndex(0), 
		[accounts] // eslint-disable-line
	) 

	// handle account switching
	let switchAccount = address => {
		const accountIndex = findIndex(accounts, {address: address})
		if(accountIndex >= 0 && accountIndex !== activeAccountIndex) {
			setActiveAccountIndex(accountIndex)
		}
	}

	return <Context.Provider 
		value={{
			...accounts[activeAccountIndex],
			status,
			message,
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