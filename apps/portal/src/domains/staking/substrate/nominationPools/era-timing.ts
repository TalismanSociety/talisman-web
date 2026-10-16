import type { MetadataLookup } from "@polkadot-api/metadata-builders"

import { constantOf, hasPallet, hasStorage } from "@/domains/chains/chain-runtime"

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MINIMUM_PERIOD_THRESHOLD = 500n
const DEFAULT_BLOCK_TIME = 6_000n

const number = (value: bigint | number | undefined) =>
	value === undefined ? undefined : Number(value)

export const expectedBlockTimeMs = (lookup: MetadataLookup): number => {
	const babe = constantOf<bigint>(lookup, "Babe", "ExpectedBlockTime")
	if (babe !== undefined) return Number(babe)
	const difficulty = constantOf<bigint>(lookup, "Difficulty", "TargetBlockTime")
	if (difficulty !== undefined) return Number(difficulty)
	const subspace = constantOf<bigint>(lookup, "Subspace", "ExpectedBlockTime")
	if (subspace !== undefined) return Number(subspace)
	const minimumPeriod = constantOf<bigint>(lookup, "Timestamp", "MinimumPeriod")
	if (minimumPeriod !== undefined && minimumPeriod >= MINIMUM_PERIOD_THRESHOLD)
		return Number(minimumPeriod * 2n)
	return Number(hasPallet(lookup, "ParachainSystem") ? DEFAULT_BLOCK_TIME * 2n : DEFAULT_BLOCK_TIME)
}

const epochDuration = (lookup: MetadataLookup) =>
	number(constantOf<bigint>(lookup, "Babe", "EpochDuration"))

const sessionsPerEra = (lookup: MetadataLookup) =>
	number(constantOf<number>(lookup, "Staking", "SessionsPerEra"))

export const expectedSessionTimeMs = (lookup: MetadataLookup) =>
	(epochDuration(lookup) ?? 1) * expectedBlockTimeMs(lookup)

export const expectedEraTimeMs = (lookup: MetadataLookup) =>
	(sessionsPerEra(lookup) ?? 1) * expectedSessionTimeMs(lookup)

export const stakingEraDurationMs = (babeLookup: MetadataLookup, stakingLookup: MetadataLookup) =>
	(epochDuration(babeLookup) ?? 0) *
	expectedBlockTimeMs(babeLookup) *
	(sessionsPerEra(stakingLookup) ?? 0)

export const stakingErasPerYear = (babeLookup: MetadataLookup, stakingLookup: MetadataLookup) => {
	const eraDuration = stakingEraDurationMs(babeLookup, stakingLookup)
	return eraDuration === 0 ? 0 : Math.floor((365 * MS_PER_DAY) / eraDuration)
}

export const historyDepth = (lookup: MetadataLookup) =>
	constantOf<number>(lookup, "Staking", "HistoryDepth") ?? 0

const bondingDuration = (lookup: MetadataLookup) =>
	constantOf<number>(lookup, "Staking", "BondingDuration") ?? 0

export const fastUnbondDuration = (lookup: MetadataLookup) =>
	constantOf<number>(lookup, "Staking", "NominatorFastUnbondDuration")

export const nominatorBondingDurationEras = (
	lookup: MetadataLookup,
	areNominatorsSlashable: boolean
) => {
	const fast = fastUnbondDuration(lookup)
	return fast !== undefined && !areNominatorsSlashable ? fast : bondingDuration(lookup)
}

export const hasBabe = (lookup: MetadataLookup) => hasStorage(lookup, "Babe", "CurrentSlot")

export type SessionIndexes = {
	currentIndex: number
	activeEra: number
	erasStartSessionIndex: number | undefined
}

export type BabeSlots = { currentSlot: bigint; epochIndex: bigint; genesisSlot: bigint }

export type SessionProgress = {
	currentIndex: number
	activeEra: number
	sessionLength: number
	sessionsPerEra: number
	eraLength: number
	isEpoch: boolean
	sessionProgress: number
	eraProgress: number
}

export const sessionProgressOf = (
	lookup: MetadataLookup,
	{ currentIndex, activeEra, erasStartSessionIndex }: SessionIndexes,
	slots: BabeSlots | undefined
): SessionProgress => {
	const sessionLength = epochDuration(lookup) ?? 1
	const perEra = sessionsPerEra(lookup) ?? 1
	const info = {
		currentIndex,
		activeEra,
		sessionLength,
		sessionsPerEra: perEra,
		eraLength: perEra * sessionLength,
		isEpoch: hasBabe(lookup),
	}
	if (!slots) return { ...info, sessionProgress: 0, eraProgress: 0 }
	const epochStartSlot = slots.epochIndex * BigInt(sessionLength) + slots.genesisSlot
	const sessionProgress = slots.currentSlot - epochStartSlot
	const eraProgress =
		BigInt(currentIndex - (erasStartSessionIndex ?? 1)) * BigInt(sessionLength) + sessionProgress
	return { ...info, sessionProgress: Number(sessionProgress), eraProgress: Number(eraProgress) }
}

const erasOrSessionsRemaining = (count: number, { eraLength, eraProgress }: SessionProgress) =>
	(count - 1) * eraLength + eraLength - eraProgress

export const eraEtaMs = (
	erasOrSessions: number,
	progress: SessionProgress,
	babeLookup: MetadataLookup
) => {
	const remaining = erasOrSessionsRemaining(erasOrSessions, progress)
	return progress.isEpoch
		? remaining * expectedBlockTimeMs(babeLookup)
		: remaining * expectedSessionTimeMs(babeLookup)
}
