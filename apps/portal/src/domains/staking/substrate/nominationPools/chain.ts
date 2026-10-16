import { AccountId } from "@polkadot-api/substrate-bindings"
import { fromHex, mergeUint8 } from "@polkadot-api/utils"
import { isNetworkDot } from "@talismn/chaindata-provider"
import type { SS58String } from "polkadot-api"
import { combineLatest, defer, from, map, type Observable, of, switchMap } from "rxjs"

import {
	type ChainRuntime,
	constantOf,
	getChainRuntime$,
	hasStorage,
} from "@/domains/chains/chain-runtime"
import { networksByGenesisHash$, networksById$ } from "@/domains/chains/chaindata-provider"

import { chainReadId$ } from "@/domains/common/chainReadId"

import { type BabeSlots, hasBabe, type SessionIndexes } from "./era-timing"

export type Runtimes = { runtime: ChainRuntime; babeRuntime: ChainRuntime }

const BEST = { at: "best" } as const

const valueOf = <T>(source$: Observable<{ value: T }>) => source$.pipe(map(({ value }) => value))

const relayGenesisHashOf = (genesisHash: string): Observable<string | undefined> =>
	combineLatest([networksByGenesisHash$, networksById$]).pipe(
		map(([byGenesisHash, byId]) => {
			const network = byGenesisHash[genesisHash as `0x${string}`]
			if (!isNetworkDot(network) || network.topology.type !== "parachain") return undefined
			const relay = byId[network.topology.relayId]
			return isNetworkDot(relay) ? relay.genesisHash : undefined
		})
	)

export const runtimes$ = (genesisHash: string): Observable<Runtimes> =>
	defer(() =>
		combineLatest([
			getChainRuntime$(genesisHash),
			relayGenesisHashOf(genesisHash).pipe(
				switchMap((relay) => (relay ? getChainRuntime$(relay) : of(undefined)))
			),
		])
	).pipe(map(([runtime, relayRuntime]) => ({ runtime, babeRuntime: relayRuntime ?? runtime })))

const EMPTY_H256 = new Uint8Array(32)
const utf8 = new TextDecoder()
const MOD_PREFIX = new TextEncoder().encode("modl")

export const ss58PrefixOf = ({ lookup }: ChainRuntime) =>
	constantOf<number>(lookup, "System", "SS58Prefix")

const poolAccount = (runtime: ChainRuntime, poolId: number, index: number): SS58String => {
	const palletId = constantOf<string>(runtime.lookup, "NominationPools", "PalletId")
	if (!palletId) throw new Error("NominationPools has no PalletId")
	const poolIdBytes = new Uint8Array(4)
	new DataView(poolIdBytes.buffer).setUint32(0, poolId, true)
	return AccountId(ss58PrefixOf(runtime)).dec(
		mergeUint8(MOD_PREFIX, fromHex(palletId), new Uint8Array([index]), poolIdBytes, EMPTY_H256)
	)
}

export const poolStash = (runtime: ChainRuntime, poolId: number) => poolAccount(runtime, poolId, 0)

export const watchPoolMember = ({ api }: ChainRuntime, address: SS58String) =>
	valueOf(api.query.NominationPools.PoolMembers.watchValue(address, BEST))

export const watchClaimPermission = ({ api }: ChainRuntime, address: SS58String) =>
	valueOf(api.query.NominationPools.ClaimPermissions.watchValue(address, BEST))

export const watchNominators = ({ api }: ChainRuntime, stash: SS58String) =>
	valueOf(api.query.Staking.Nominators.watchValue(stash, BEST))

export const watchActiveEra = ({ api }: ChainRuntime) =>
	valueOf(api.query.Staking.ActiveEra.watchValue(BEST))

export const watchAccount = ({ api }: ChainRuntime, address: SS58String) =>
	valueOf(api.query.System.Account.watchValue(address, BEST))

export const watchMinJoinBond = ({ api }: ChainRuntime) =>
	valueOf(api.query.NominationPools.MinJoinBond.watchValue(BEST))

export const watchBondedPool = ({ api }: ChainRuntime, poolId: number) =>
	valueOf(api.query.NominationPools.BondedPools.watchValue(poolId, BEST))

export const watchTotalIssuance = ({ api }: ChainRuntime) =>
	valueOf(api.query.Balances.TotalIssuance.watchValue(BEST))

export const poolNames = ({ api }: ChainRuntime, poolIds: number[]) =>
	poolIds.length === 0
		? of([] as string[])
		: from(
				api.query.NominationPools.Metadata.getValues(
					poolIds.map((id) => [id] as [number]),
					BEST
				)
			).pipe(map((names) => names.map((name) => utf8.decode(name))))

export const slashingSpanCount = ({ api, lookup }: ChainRuntime, stash: SS58String) =>
	hasStorage(lookup, "Staking", "SlashingSpans")
		? from(api.query.Staking.SlashingSpans.getValue(stash, BEST)).pipe(
				map((spans) => (spans === undefined ? 0 : spans.prior.length + 1))
			)
		: of(0)

export const nominatesActiveValidator = (
	{ api }: ChainRuntime,
	era: number,
	targets: SS58String[]
) =>
	targets.length === 0
		? of(false)
		: from(
				api.query.Staking.ErasStakersOverview.getValues(
					targets.map((target) => [era, target] as [number, SS58String]),
					BEST
				)
			).pipe(map((exposures) => exposures.some((exposure) => exposure !== undefined)))

export const pendingRewards = ({ api }: ChainRuntime, address: SS58String) =>
	chainReadId$.pipe(switchMap(() => api.apis.NominationPoolsApi.pending_rewards(address, BEST)))

const watchSessionIndexes = (runtime: ChainRuntime): Observable<SessionIndexes> => {
	const { api, lookup } = runtime
	return combineLatest([
		valueOf(api.query.Session.CurrentIndex.watchValue(BEST)),
		watchActiveEra(runtime),
	]).pipe(
		switchMap(([currentIndex, activeEra]) => {
			const era = activeEra?.index ?? 0
			const start$ = hasStorage(lookup, "Staking", "ErasStartSessionIndex")
				? valueOf(api.query.Staking.ErasStartSessionIndex.watchValue(era, BEST))
				: of(undefined)
			return start$.pipe(
				map((start) => ({ currentIndex, activeEra: era, erasStartSessionIndex: start }))
			)
		})
	)
}

const watchBabeSlots = ({ api, lookup }: ChainRuntime): Observable<BabeSlots | undefined> =>
	hasBabe(lookup)
		? combineLatest([
				valueOf(api.query.Babe.CurrentSlot.watchValue(BEST)),
				valueOf(api.query.Babe.EpochIndex.watchValue(BEST)),
				valueOf(api.query.Babe.GenesisSlot.watchValue(BEST)),
			]).pipe(
				map(([currentSlot, epochIndex, genesisSlot]) => ({ currentSlot, epochIndex, genesisSlot }))
			)
		: of(undefined)

export const watchSessionProgressInputs = (runtime: ChainRuntime) =>
	combineLatest([watchSessionIndexes(runtime), watchBabeSlots(runtime)])

export const areNominatorsSlashable = ({ api, lookup }: ChainRuntime) =>
	hasStorage(lookup, "Staking", "AreNominatorsSlashable")
		? from(api.query.Staking.AreNominatorsSlashable.getValue(BEST))
		: of(true)

export const eraRewards = ({ api }: ChainRuntime, eras: number[]) =>
	eras.length === 0
		? of([] as bigint[])
		: from(
				api.query.Staking.ErasValidatorReward.getValues(
					eras.map((era) => [era] as [number]),
					BEST
				)
			).pipe(map((rewards) => rewards.map((reward) => reward ?? 0n)))

export const eraTotalStakes = ({ api }: ChainRuntime, eras: number[]) =>
	eras.length === 0
		? of([] as bigint[])
		: from(
				api.query.Staking.ErasTotalStake.getValues(
					eras.map((era) => [era] as [number]),
					BEST
				)
			)

export const eraTotalStake = ({ api }: ChainRuntime, era: number) =>
	from(api.query.Staking.ErasTotalStake.getValue(era, BEST))

export const chainTokenOf = ({ chainSpec }: ChainRuntime) => {
	const { tokenDecimals, tokenSymbol } = chainSpec.properties as {
		tokenDecimals?: number | number[]
		tokenSymbol?: string | string[]
	}
	return {
		decimals: (Array.isArray(tokenDecimals) ? tokenDecimals[0] : tokenDecimals) ?? 0,
		symbol: Array.isArray(tokenSymbol) ? tokenSymbol[0] : tokenSymbol,
	}
}

export const existentialDeposit = ({ lookup }: ChainRuntime) =>
	constantOf<bigint>(lookup, "Balances", "ExistentialDeposit") ?? 0n
