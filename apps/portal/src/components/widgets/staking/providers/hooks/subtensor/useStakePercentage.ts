import { usePortfolioBalances } from "@/domains/balances/hooks"
import { BITTENSOR_NETWORK_ID, getSubtensorStakes } from "@/domains/balances/subtensor-stakes"

import { ROOT_NETUID } from "../../../subtensor/constants"

type BittensorBalances = {
	total: bigint
	rootStakedBalance: bigint
	subnetStakedBalanceInTao: bigint
}

const useStakePercentage = (hasDTaoStaking: boolean) => {
	const portfolioBalances = usePortfolioBalances()

	const subtensorBalances = portfolioBalances.find(
		(balance) => balance.networkId === BITTENSOR_NETWORK_ID
	)

	const { total, rootStakedBalance, subnetStakedBalanceInTao } =
		subtensorBalances.each.reduce<BittensorBalances>(
			(acc, curr) => {
				acc.total += curr.total.planck
				for (const { netuid, taoPlanck } of getSubtensorStakes(curr)) {
					if (netuid === ROOT_NETUID) {
						acc.rootStakedBalance += taoPlanck
					} else {
						acc.subnetStakedBalanceInTao += taoPlanck
					}
				}
				return acc
			},
			{ rootStakedBalance: 0n, subnetStakedBalanceInTao: 0n, total: 0n }
		)

	if (total === 0n) return 0

	if (hasDTaoStaking) return Number(subnetStakedBalanceInTao) / Number(total)

	return Number(rootStakedBalance) / Number(total)
}

export default useStakePercentage
