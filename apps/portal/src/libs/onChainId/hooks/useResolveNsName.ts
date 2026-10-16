import { isPotentialEns } from "@talismn/on-chain-id"
import { useAtomValue } from "jotai"
import { loadable } from "jotai/utils"
import { useState } from "react"
import { useDebounce } from "react-use"
import { isEthereumAddress } from "@/util/addresses"
import { resolveNsNameFamily } from "../atoms/onChainIdResolver"

/**
 * Use this hook to resolve a string like `0xkheops.eth` to an address.
 */
export const useResolveNsName = (resolveName?: string) => {
	const [name, setName] = useState(resolveName)
	useDebounce(() => setName(resolveName), 750, [resolveName])

	// check if name is something we can look up
	const nsLookupName =
		// don't look up undefined
		name !== undefined &&
		// don't look up ethereum addresses
		!isEthereumAddress(name) &&
		// only look up potential ns names
		isPotentialEns(name)
			? name
			: undefined

	// let caller detect if we're going to look name up or not
	const isNsLookup = nsLookupName !== undefined

	const result = useAtomValue(loadable(resolveNsNameFamily(isNsLookup ? name : undefined)))
	const live = (name && result?.state === "hasData" && result?.data?.get(name)) || null

	const isNsFetching = result.state === "loading"

	const [address, nsLookupType] = live ?? [null, null]

	return [address, { isNsLookup, nsLookupType, isNsFetching }] as const
}
