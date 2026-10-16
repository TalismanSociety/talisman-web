import { useEffect } from "react"
import { skip } from "rxjs"

import { selectedAccountAddresses$, setLookupAccountAddress } from "./accounts"

export const AccountWatcher = () => {
	useEffect(() => {
		const subscription = selectedAccountAddresses$
			.pipe(skip(1))
			.subscribe(() => setLookupAccountAddress(undefined))
		return () => subscription.unsubscribe()
	}, [])

	return null
}
