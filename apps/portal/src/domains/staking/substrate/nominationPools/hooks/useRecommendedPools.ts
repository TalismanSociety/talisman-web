import { useRecoilValue } from "recoil"
import { switchMap } from "rxjs"
import { useChainState } from "@/domains/chains/hooks"
import { assertChain } from "@/domains/chains/utils"
import { bindSuspended } from "@/util/loadable"

import { type PoolPriority, recommendedPools$ } from "../pools"
import { chainRuntimes$ } from "./useRuntimes"

const [useRecommendedPoolsFor] = bindSuspended((genesisHash: string, priority: string) =>
	chainRuntimes$(genesisHash).pipe(
		switchMap(({ runtime }) => recommendedPools$(runtime, JSON.parse(priority) as PoolPriority))
	)
)

export const useRecommendedPools = () => {
	const chain = useRecoilValue(useChainState())
	assertChain(chain, { hasNominationPools: true })
	return useRecommendedPoolsFor(chain.genesisHash, JSON.stringify(chain.priorityPool ?? null))
}

export const usePoolCommission = () => {
	const pools = useRecommendedPools()
	const getCurrentCommission = (poolId: number) =>
		pools.find((pool) => pool.poolId === poolId)?.commissionPercent ?? 0
	return { getCurrentCommission }
}
