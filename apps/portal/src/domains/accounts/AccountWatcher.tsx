import { useEffect } from "react"
import { distinctUntilChanged, skip } from "rxjs"

import {
	accountListsRetained$,
	selectedAccountAddresses$,
	setLookupAccountAddress,
} from "./accounts"

export const AccountWatcher = () => {
	useEffect(() => {
		const subscription = accountListsRetained$.subscribe()
		subscription.add(
			selectedAccountAddresses$
				.pipe(distinctUntilChanged(), skip(1))
				.subscribe(() => setLookupAccountAddress(undefined))
		)
		return () => subscription.unsubscribe()
	}, [])

	return null
}
