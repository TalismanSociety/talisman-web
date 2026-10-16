import sample from "lodash/sample"
import type { SS58String } from "polkadot-api"
import { from, map, type Observable, of, switchMap } from "rxjs"

import { type ChainRuntime, hasPallet, hasStorage } from "@/domains/chains/chain-runtime"
import type { BondedPoolValue } from "@/domains/chains/portal-runtime"

import { poolNames } from "./chain"

export type PoolSummary = {
	poolId: number
	name: string | undefined
	points: bigint
	memberCounter: number
	commissionPercent: number
}

const PERBILL = 1_000_000_000n

export const commissionPercentOf = (bondedPool: BondedPoolValue) => {
	const current = bondedPool.commission.current?.[0]
	if (current === undefined) return 0
	return Number((Number((BigInt(current) * 10_000n) / PERBILL) / 100).toFixed(2))
}

const recommendedPoolIds = async ({ api, lookup }: ChainRuntime): Promise<number[]> => {
	if (!hasPallet(lookup, "Identity") || !hasStorage(lookup, "Staking", "ErasStakers")) return []
	const rewardPoolCount = await api.query.NominationPools.CounterForRewardPools.getValue({
		at: "best",
	})
	const poolIds = Array.from({ length: rewardPoolCount }, (_, index) => index + 1)
	const bondedPools = await api.query.NominationPools.BondedPools.getValues(
		poolIds.map((id) => [id] as [number]),
		{ at: "best" }
	)
	const roots = bondedPools.map((pool) =>
		pool?.state.type === "Open" ? (pool.roles.root as SS58String | undefined) : undefined
	)
	const candidates = roots.filter((root): root is SS58String => root !== undefined)
	const identities = await api.query.Identity.IdentityOf.getValues(
		candidates.map((root) => [root] as [SS58String]),
		{ at: "best" }
	)
	const verified = new Set(candidates.filter((_, index) => identities[index] !== undefined))
	return poolIds.filter((_, index) => {
		const root = roots[index]
		return root !== undefined && verified.has(root)
	})
}

export type PoolPriority = number | number[] | undefined

export const sortPools = <T extends { poolId: number; points: bigint }>(
	pools: T[],
	priorityPool: number | undefined,
	priorityPools: number[],
	recommended: number[]
) =>
	[...pools].sort((a, b) =>
		a.poolId === priorityPool && b.poolId !== priorityPool
			? -1
			: b.poolId === priorityPool && a.poolId !== priorityPool
				? 1
				: priorityPools.includes(a.poolId) && !priorityPools.includes(b.poolId)
					? -1
					: priorityPools.includes(b.poolId) && !priorityPools.includes(a.poolId)
						? 1
						: recommended.includes(a.poolId) && !recommended.includes(b.poolId)
							? -1
							: recommended.includes(b.poolId) && !recommended.includes(a.poolId)
								? 1
								: b.points > a.points
									? 1
									: b.points < a.points
										? -1
										: 0
	)

export const recommendedPools$ = (
	runtime: ChainRuntime,
	priority: PoolPriority
): Observable<PoolSummary[]> =>
	from(
		Promise.all([
			recommendedPoolIds(runtime),
			runtime.api.query.NominationPools.BondedPools.getEntries({ at: "best" }),
		])
	).pipe(
		switchMap(([recommended, entries]) => {
			const pools = entries.map(({ keyArgs: [poolId], value }) => ({ poolId, bondedPool: value }))
			return (
				pools.length === 0
					? of([])
					: poolNames(
							runtime,
							pools.map(({ poolId }) => poolId)
						)
			).pipe(
				map((names) => {
					const priorityPool =
						typeof priority === "number"
							? priority
							: Array.isArray(priority)
								? sample(priority)
								: undefined
					const priorityPools =
						typeof priority === "number" ? [priority] : Array.isArray(priority) ? priority : []
					const summaries = pools.map(({ poolId, bondedPool }, index) => ({
						poolId,
						name: names[index],
						points: bondedPool.points,
						memberCounter: bondedPool.member_counter,
						commissionPercent: commissionPercentOf(bondedPool),
					}))
					return sortPools(summaries, priorityPool, priorityPools, recommended)
				})
			)
		})
	)
