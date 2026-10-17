import { useEffect } from "react"

import { useStakingBalancesEnabledTokens } from "@/components/widgets/staking/providers/hooks/useProvidersData"
import { useAccounts, useOwnAccounts } from "@/domains/accounts/accounts"

import {
	balancesCacheWrites$,
	setBalancesAddresses,
	setBalancesTokenIds,
	setCacheableBalancesAddresses,
} from "./balances"
import { useBalancesReportEffect } from "./hooks"

export const BalancesWatcher = () => {
	const accounts = useAccounts()
	const ownAccounts = useOwnAccounts()
	const tokenIds = useStakingBalancesEnabledTokens()

	useEffect(() => setBalancesAddresses(accounts.map(({ address }) => address)), [accounts])
	useEffect(
		() => setCacheableBalancesAddresses(ownAccounts.map(({ address }) => address)),
		[ownAccounts]
	)
	useEffect(() => setBalancesTokenIds(tokenIds), [tokenIds])
	useEffect(() => {
		const subscription = balancesCacheWrites$.subscribe()
		return () => subscription.unsubscribe()
	}, [])

	return null
}

export const BalancesReporter = () => {
	useBalancesReportEffect()
	return null
}
