import { useEffect } from "react"
import { useRecoilValue } from "recoil"

import { useStakingBalancesEnabledTokens } from "@/components/widgets/staking/providers/hooks/useProvidersData"
import { accountsState } from "@/domains/accounts/recoils"

import { setBalancesAddresses, setBalancesTokenIds } from "./balances"
import { useBalancesReportEffect } from "./hooks"

export const BalancesWatcher = () => {
	const accounts = useRecoilValue(accountsState)
	const tokenIds = useStakingBalancesEnabledTokens()

	useEffect(() => setBalancesAddresses(accounts.map(({ address }) => address)), [accounts])
	useEffect(() => setBalancesTokenIds(tokenIds), [tokenIds])

	return null
}

export const BalancesReporter = () => {
	useBalancesReportEffect()
	return null
}
