import { useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { useUpdateEffect } from "react-use"
import { useRecoilCallback, useRecoilValue } from "recoil"

import { lookupAccountAddressState, lookupAddressSearchKey } from "@/domains/accounts/recoils"
import { isNilOrWhitespace } from "@/util/nil"

export const LookupAddressSync = () => {
	const lookupAddress = useRecoilValue(lookupAccountAddressState)
	const location = useLocation()
	const navigate = useNavigate()
	const readLookupAddress = useRecoilCallback(
		({ snapshot }) =>
			() =>
				snapshot.getLoadable(lookupAccountAddressState).getValue(),
		[]
	)

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
		const currentLookupAddress = readLookupAddress()

		if (!search.has(lookupAddressSearchKey) && !isNilOrWhitespace(currentLookupAddress)) {
			search.set(lookupAddressSearchKey, currentLookupAddress)
			void navigate({ to: ".", search: Object.fromEntries(search), replace: true })
		}
	}, [location, navigate, readLookupAddress])

	return null
}
