import { useEffect } from "react"
import { useRecoilValue } from "recoil"

import { useStakingBalancesEnabledTokens } from "@/components/widgets/staking/providers/hooks/useProvidersData"
import { accountsState, ownAccountsState } from "@/domains/accounts/recoils"

import {
	balancesCacheWrites$,
	setBalancesAddresses,
	setBalancesTokenIds,
	setCacheableBalancesAddresses,
} from "./balances"
import { useBalancesReportEffect } from "./hooks"

export const BalancesWatcher = () => {
	const accounts = useRecoilValue(accountsState)
	const ownAccounts = useRecoilValue(ownAccountsState)
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
