import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
		const search = new URLSearchParams(location.search)

		if (isNilOrWhitespace(lookupAddress)) {
			search.delete(lookupAddressSearchKey)
		} else {
			search.set(lookupAddressSearchKey, lookupAddress)
		}

		navigate(`?${search.toString()}`, { replace: true })
	}, [lookupAddress])

	useEffect(() => {
		const search = new URLSearchParams(location.search)
		const currentLookupAddress = readLookupAddress()

		if (!search.has(lookupAddressSearchKey) && !isNilOrWhitespace(currentLookupAddress)) {
			search.set(lookupAddressSearchKey, currentLookupAddress)
			navigate(`?${search.toString()}`, { replace: true })
		}
	}, [location, navigate, readLookupAddress])

	return null
}
