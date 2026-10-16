import { useContext, useMemo } from "react"
import { useRecoilValue } from "recoil"

import { selectedSubstrateAccountsState } from "@/domains/accounts/recoils"
import { ChainContext } from "@/domains/chains/contexts"
import { useTokenAmountFromPlanck } from "@/domains/common/hooks/useTokenAmount"
import {
	addressesKey,
	useAccountBalances,
	useChainToken,
} from "@/domains/staking/substrate/nominationPools/hooks/useBalances"
import { Decimal } from "@/util/Decimal"

const usePoolAvailableBalance = () => {
	const { genesisHash } = useContext(ChainContext)
	const accounts = useRecoilValue(selectedSubstrateAccountsState)
	const addresses = useMemo(() => accounts.map((x) => x.address), [accounts])
	const balances = useAccountBalances(genesisHash, addressesKey(addresses))
	const token = useChainToken(genesisHash)

	const availableBalance = useMemo(
		() =>
			Decimal.fromPlanck(
				balances.reduce((total, { transferable }) => total + transferable, 0n),
				token.decimals,
				{ currency: token.symbol }
			),
		[balances, token]
	)

	const fiatAmount = useTokenAmountFromPlanck(availableBalance.planck).fiatAmount

	return { availableBalance, fiatAmount }
}

export default usePoolAvailableBalance
