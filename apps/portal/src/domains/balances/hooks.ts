import { useState } from "react"
import { useUpdateEffect } from "react-use"
import { useRecoilValue } from "recoil"

import { track } from "@/domains/analytics/client"
import { useDebounce } from "@/hooks/useDebounce"
import { useThrottle } from "@/hooks/useThrottle"

import { writeableBalancesState } from "./recoils"

export const useBalancesReportEffect = () => {
	const balances = useThrottle(useDebounce(useRecoilValue(writeableBalancesState), 5_000), 15_000)
	const [updateCount, setUpdateCount] = useState(0)

	// TODO: use normal effect after we redo balances section with proper suspense support
	// right now the first received balance value will be a default empty one
	useUpdateEffect(() => {
		if (updateCount >= 1) {
			return
		}

		setUpdateCount((x) => x + 1)

		const reported = balances
			.find((balance) => balance.status !== "stale")
			.each.filter(
				(balance) =>
					(balance.chain === null || !("isCustom" in balance.chain && balance.chain.isCustom)) &&
					(balance.token === null || !("isCustom" in balance.token && balance.token.isCustom)) &&
					(balance.total.fiat("usd") ?? 0) > 0
			)

		track("Report portfolio balances", {
			tokens: reported.length,
			chains: new Set(reported.map((balance) => balance.chainId ?? balance.evmNetworkId)).size,
		})
	}, [balances])
}
