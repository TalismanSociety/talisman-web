import { combineLatest, map, type Observable, of, switchMap } from "rxjs"

import type { StakeStatus } from "@/components/recipes/StakeStatusIndicator"
import type { ChainRuntime } from "@/domains/chains/chain-runtime"
import type { ClaimPermissionValue, PoolMemberValue } from "@/domains/chains/portal-runtime"

import {
	nominatesActiveValidator,
	pendingRewards,
	poolNames,
	poolStash,
	slashingSpanCount,
	watchActiveEra,
	watchClaimPermission,
	watchNominators,
	watchPoolMember,
} from "./chain"

type PoolUnlocking = { amount: bigint; erasTilWithdrawable: number }

export type PoolPosition = {
	address: string
	poolMember: PoolMemberValue
	pendingRewards: bigint | undefined
	poolName: string | undefined
	status: StakeStatus
	withdrawable: bigint
	unlockings: PoolUnlocking[]
	totalUnlocking: bigint
	slashingSpan: number
	claimPermission: ClaimPermissionValue["type"]
}

export const poolUnbonding = (poolMember: PoolMemberValue, activeEra: number) => {
	const all = poolMember.unbonding_eras.map(([era, amount]) => ({
		amount,
		erasTilWithdrawable: era <= activeEra ? undefined : era - activeEra,
	}))
	const withdrawable = all
		.filter((unlock) => unlock.erasTilWithdrawable === undefined)
		.reduce((total, unlock) => total + unlock.amount, 0n)
	const unlockings = all.filter(
		(unlock): unlock is PoolUnlocking => unlock.erasTilWithdrawable !== undefined
	)
	return { withdrawable, unlockings }
}

export const poolStatus = (
	points: bigint,
	targets: string[],
	nominatesActive: boolean
): StakeStatus => {
	if (points === 0n) return "not_earning_rewards"
	if (targets.length === 0) return "not_nominating"
	return nominatesActive ? "earning_rewards" : "waiting"
}

type Membership = { address: string; poolMember: PoolMemberValue }

const memberships$ = (runtime: ChainRuntime, addresses: string[]): Observable<Membership[]> =>
	addresses.length === 0
		? of([])
		: combineLatest(
				addresses.map((address) =>
					watchPoolMember(runtime, address).pipe(
						map((poolMember) => (poolMember ? { address, poolMember } : undefined))
					)
				)
			).pipe(
				map((members) => members.filter((member): member is Membership => member !== undefined))
			)

const position$ = (
	runtime: ChainRuntime,
	{ address, poolMember }: Membership,
	activeEra: number
): Observable<Omit<PoolPosition, "poolName">> => {
	const stash = poolStash(runtime, poolMember.pool_id)
	return combineLatest([
		pendingRewards(runtime, address),
		watchClaimPermission(runtime, address),
		watchNominators(runtime, stash).pipe(
			switchMap((nominations) => {
				const targets = nominations?.targets ?? []
				return nominatesActiveValidator(runtime, activeEra, targets).pipe(
					map((nominatesActive) => poolStatus(poolMember.points, targets, nominatesActive))
				)
			})
		),
		slashingSpanCount(runtime, stash),
	]).pipe(
		map(([rewards, claimPermission, status, slashingSpan]) => {
			const { withdrawable, unlockings } = poolUnbonding(poolMember, activeEra)
			return {
				address,
				poolMember,
				pendingRewards: rewards,
				status,
				withdrawable,
				unlockings,
				totalUnlocking: unlockings.reduce((total, unlock) => total + unlock.amount, 0n),
				slashingSpan,
				claimPermission: claimPermission.type,
			}
		})
	)
}

export const poolPositions$ = (
	runtime: ChainRuntime,
	addresses: string[]
): Observable<PoolPosition[]> =>
	combineLatest([memberships$(runtime, addresses), watchActiveEra(runtime)]).pipe(
		switchMap(([memberships, activeEra]) => {
			if (memberships.length === 0) return of([])
			const era = activeEra?.index ?? 0
			return combineLatest([
				combineLatest(memberships.map((membership) => position$(runtime, membership, era))),
				poolNames(
					runtime,
					memberships.map(({ poolMember }) => poolMember.pool_id)
				),
			]).pipe(
				map(([positions, names]) =>
					positions.map((position, index) => ({ ...position, poolName: names[index] }))
				)
			)
		})
	)
