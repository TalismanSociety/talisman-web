import { combineLatest, map, type Observable, of, switchMap } from "rxjs"

import type { ChainRuntime } from "@/domains/chains/chain-runtime"
import type { StakingLedgerValue } from "@/domains/chains/portal-runtime"

import { watchActiveEra } from "../nominationPools/chain"
import { slashingSpanCount, watchController, watchCurrentEra, watchLedger } from "./chain"

export type Unlocking = { remainingEras: number; value: bigint }

export type ValidatorPosition = {
	address: string
	controller: string
	active: bigint
	unlocking: Unlocking[]
	totalUnlocking: bigint
	redeemable: bigint
	slashingSpan: number
}

type UnlockChunk = StakingLedgerValue["unlocking"][number]

export const unlockingOf = (chunks: UnlockChunk[], activeEra: number): Unlocking[] => {
	const byEra = new Map<number, bigint>()
	for (const { era, value } of chunks) {
		if (era > activeEra) byEra.set(era, (byEra.get(era) ?? 0n) + value)
	}
	return [...byEra]
		.sort(([a], [b]) => a - b)
		.map(([era, value]) => ({ remainingEras: era - activeEra, value }))
}

export const redeemableOf = (chunks: UnlockChunk[], currentEra: number) =>
	chunks.reduce((total, { era, value }) => (era > currentEra ? total : total + value), 0n)

type Bonded = { address: string; controller: string; ledger: StakingLedgerValue }

const watchBonded = (runtime: ChainRuntime, address: string): Observable<Bonded | undefined> =>
	watchController(runtime, address).pipe(
		switchMap((controller) =>
			controller === undefined
				? of(undefined)
				: watchLedger(runtime, controller).pipe(
						map((ledger) => (ledger ? { address, controller, ledger } : undefined))
					)
		)
	)

const position$ = (
	runtime: ChainRuntime,
	{ address, controller, ledger }: Bonded,
	activeEra: number,
	currentEra: number
): Observable<ValidatorPosition> =>
	slashingSpanCount(runtime, address).pipe(
		map((slashingSpan) => {
			const unlocking = unlockingOf(ledger.unlocking, activeEra)
			return {
				address,
				controller,
				active: ledger.active,
				unlocking,
				totalUnlocking: unlocking.reduce((total, { value }) => total + value, 0n),
				redeemable: redeemableOf(ledger.unlocking, currentEra),
				slashingSpan,
			}
		})
	)

export const validatorPositions$ = (
	runtime: ChainRuntime,
	addresses: string[]
): Observable<ValidatorPosition[]> =>
	addresses.length === 0
		? of([])
		: combineLatest([
				watchActiveEra(runtime),
				watchCurrentEra(runtime),
				combineLatest(addresses.map((address) => watchBonded(runtime, address))),
			]).pipe(
				switchMap(([activeEra, currentEra, bonded]) => {
					const staked = bonded.filter(
						(entry): entry is Bonded => entry !== undefined && entry.ledger.active > 0n
					)
					return staked.length === 0
						? of([])
						: combineLatest(
								staked.map((entry) =>
									position$(runtime, entry, activeEra?.index ?? 0, currentEra ?? 0)
								)
							)
				})
			)
