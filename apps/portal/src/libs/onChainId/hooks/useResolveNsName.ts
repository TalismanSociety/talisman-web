import { isPotentialEns } from "@talismn/on-chain-id"
import { useState } from "react"
import { useDebounce } from "react-use"
import { isEthereumAddress } from "@/util/addresses"
import { useNsNameResolution } from "../resolver"

export const useResolveNsName = (resolveName?: string) => {
	const [name, setName] = useState(resolveName)
	useDebounce(() => setName(resolveName), 750, [resolveName])

	const nsLookupName =
		name !== undefined && !isEthereumAddress(name) && isPotentialEns(name) ? name : undefined

	const isNsLookup = nsLookupName !== undefined

	const result = useNsNameResolution(nsLookupName ?? "")
	const live = (name && result.status === "success" && result.data?.get(name)) || null

	const isNsFetching = result.status === "loading"

	const [address, nsLookupType] = live ?? [null, null]

	return [address, { isNsLookup, nsLookupType, isNsFetching }] as const
}
