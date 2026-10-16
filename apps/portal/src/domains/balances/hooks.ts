import type { Balances } from "@talismn/balances"
import { useMemo, useState } from "react"
import { useUpdateEffect } from "react-use"
import type { RecoilValueReadOnly } from "recoil"
import { useRecoilValue } from "recoil"
import {
	type Account,
	ownPortfolioAccountsState,
	portfolioAccountsState,
	selectedAccountsState,
} from "@/domains/accounts/recoils"
import { track } from "@/domains/analytics/client"
import { portfolioReportOf } from "@/domains/analytics/events/portfolio"
import { useDebounce } from "@/hooks/useDebounce"
import { useThrottle } from "@/hooks/useThrottle"
import { encodeAnyAddress } from "@/util/addresses"

import { useBalances } from "./balances"

export const filterBalancesByAddresses = (balances: Balances, addresses: string[]) => {
	const encoded = new Set(addresses.map((address) => encodeAnyAddress(address)))
	return balances.find((balance) => encoded.has(encodeAnyAddress(balance.address)))
}

const useAccountsBalances = (accountsState: RecoilValueReadOnly<Account[]>) => {
	const balances = useBalances()
	const accounts = useRecoilValue(accountsState)
	return useMemo(
		() =>
			filterBalancesByAddresses(
				balances,
				accounts.map(({ address }) => address)
			),
		[balances, accounts]
	)
}

export const useSelectedBalances = () => useAccountsBalances(selectedAccountsState)

export const usePortfolioBalances = () => useAccountsBalances(portfolioAccountsState)

const useOwnPortfolioBalances = () => useAccountsBalances(ownPortfolioAccountsState)

export const useBalancesReportEffect = () => {
	const balances = useThrottle(useDebounce(useOwnPortfolioBalances(), 5_000), 15_000)
	const [updateCount, setUpdateCount] = useState(0)

	// TODO: use normal effect after we redo balances section with proper suspense support
	// right now the first received balance value will be a default empty one
	useUpdateEffect(() => {
		if (updateCount >= 1) {
			return
		}

		setUpdateCount((x) => x + 1)

		track(
			"Report portfolio balances",
			portfolioReportOf(
				balances
					.find((balance) => balance.status !== "stale")
					.each.filter((balance) => balance.total.planck > 0n)
					.map((balance) => ({
						symbol: balance.token?.symbol,
						networkId: balance.networkId,
						usd: balance.total.fiat("usd") ?? 0,
					}))
			)
		)
	}, [balances])
}
