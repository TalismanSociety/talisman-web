import { useEffect } from "react"
import { useAddressLookup } from "../resolver"

export const useOnChainId = (address?: string) => {
	const cached = address ? (onChainIdsCache.get(address)?.onChainId ?? null) : null

	const result = useAddressLookup(address ?? "")
	const live = (address && result.status === "success" && result.data?.get(address)) || null

	useEffect(() => {
		if (!address) return
		if (result.status !== "success") return

		if (live === null) onChainIdsCache.delete(address)
		else onChainIdsCache.set(address, { onChainId: live, updated: Date.now() })

		persistOnChainIdsCache()
	}, [address, result, live])

	const onChainId = live ?? cached ?? null

	return [onChainId] as const
}

const cacheKey = "talisman-on-chain-ids-cache"
const persistItemDuration = 15_778_476_000
const onChainIdsCache = new Map<string, { onChainId?: string | null; updated?: number }>(
	JSON.parse(localStorage.getItem(cacheKey) ?? "[]")
)
const persistOnChainIdsCache = () =>
	localStorage.setItem(
		cacheKey,
		JSON.stringify(
			Array.from(onChainIdsCache.entries()).filter(
				([, item]) => item?.updated && Date.now() - item.updated <= persistItemDuration
			)
		)
	)
