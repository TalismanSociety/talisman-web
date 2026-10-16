import { useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { useUpdateEffect } from "react-use"

import {
	lookupAccountAddress$,
	lookupAddressSearchKey,
	useLookupAccountAddress,
} from "@/domains/accounts/accounts"
import { isNilOrWhitespace } from "@/util/nil"

export const LookupAddressSync = () => {
	const lookupAddress = useLookupAccountAddress()
	const location = useLocation()
	const navigate = useNavigate()
	useUpdateEffect(() => {
		const search = new URLSearchParams(location.searchStr)

		if (isNilOrWhitespace(lookupAddress)) {
			search.delete(lookupAddressSearchKey)
		} else {
			search.set(lookupAddressSearchKey, lookupAddress)
		}

		void navigate({ to: ".", search: Object.fromEntries(search), replace: true })
	}, [lookupAddress])

	useEffect(() => {
		const search = new URLSearchParams(location.searchStr)
		const currentLookupAddress = lookupAccountAddress$.value

		if (!search.has(lookupAddressSearchKey) && !isNilOrWhitespace(currentLookupAddress)) {
			search.set(lookupAddressSearchKey, currentLookupAddress)
			void navigate({ to: ".", search: Object.fromEntries(search), replace: true })
		}
	}, [location, navigate])

	return null
}
