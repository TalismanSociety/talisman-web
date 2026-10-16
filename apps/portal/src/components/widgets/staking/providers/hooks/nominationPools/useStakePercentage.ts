import BigNumber from "bignumber.js"
import { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"

import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { ChainContext } from "@/domains/chains/contexts"
import {
	addressesKey,
	useAccountBalances,
	usePoolPoints,
} from "@/domains/staking/substrate/nominationPools/hooks/useBalances"

const useStakePercentage = () => {
	const { genesisHash } = useContext(ChainContext)
	const accounts = useRecoilValue(selectedSubstrateAccountsState)
	const addresses = useMemo(() => addressesKey(accounts.map((x) => x.address)), [accounts])
	const balances = useAccountBalances(genesisHash, addresses)
	const points = usePoolPoints(genesisHash, addresses)

	const total = useMemo(() => balances.reduce((prev, { free }) => prev + free, 0n), [balances])
	const staked = useMemo(() => points.reduce((prev, curr) => prev + curr, 0n), [points])

	return useMemo(
		() =>
			staked === 0n
				? 0
				: new BigNumber(staked.toString()).div((total + staked).toString()).toNumber(),
		[staked, total]
	)
}

export default useStakePercentage
