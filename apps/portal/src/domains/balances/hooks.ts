import type { Balances } from "@talismn/balances"
import { encodeAnyAddress } from "@talismn/util"
import { usePostHog } from "posthog-js/react"
import { useMemo, useState } from "react"
import { useUpdateEffect } from "react-use"
import type { RecoilValueReadOnly } from "recoil"
import { useRecoilValue } from "recoil"

import {
	type Account,
	portfolioAccountsState,
	selectedAccountsState,
	writeableAccountsState,
} from "@/domains/accounts/recoils"
import { useDebounce } from "@/hooks/useDebounce"
import { useThrottle } from "@/hooks/useThrottle"

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

const useWriteableBalances = () => useAccountsBalances(writeableAccountsState)

export const useBalancesReportEffect = () => {
	const digestMessage = async (message: string) => {
		const msgUint8 = new TextEncoder().encode(message)
		const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
	}

	const postHog = usePostHog()
	const balances = useThrottle(useDebounce(useWriteableBalances(), 5_000), 15_000)
	const [updateCount, setUpdateCount] = useState(0)

	// TODO: use normal effect after we redo balances section with proper suspense support
	// right now the first received balance value will be a default empty one
	useUpdateEffect(() => {
		if (updateCount >= 1) {
			return
		}

		setUpdateCount((x) => x + 1)

		void (async () => {
			const balanceRecords = await Promise.all(
				balances
					.find((balance) => balance.status !== "stale")
					.each.map(async (balance) => ({
						addressDigest: await digestMessage(balance.address),
						chainId: balance.network?.platform === "polkadot" ? balance.networkId : undefined,
						evmNetworkId: balance.network?.platform === "ethereum" ? balance.networkId : undefined,
						tokenId: balance.tokenId,
						symbol: balance.token?.symbol,
						usdValue: balance.total.fiat("usd") ?? 0,
					}))
			)

			postHog.capture("Report portfolio balances", {
				$set: {
					portfolioBalances: balanceRecords
						.sort((a, b) => b.usdValue - a.usdValue)
						.filter((balance) => balance.usdValue > 0)
						.filter((balance, index) => balance.usdValue > 1 || index < 10),
				},
			})
		})()
	}, [balances, postHog])
}
