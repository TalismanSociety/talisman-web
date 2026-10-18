// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { describe, expect, it } from "vitest"

import {
	eraEtaMs,
	expectedBlockTimeMs,
	expectedEraTimeMs,
	expectedSessionTimeMs,
	historyDepth,
	nominatorBondingDurationEras,
	sessionProgressOf,
	stakingEraDurationMs,
	stakingErasPerYear,
} from "./era-timing"

const lookupOf = (chain: string) =>
	getLookupFn(
		unifyMetadata(
			decAnyMetadata(
				new Uint8Array(
					gunzipSync(
						readFileSync(new URL(`./fixtures/${chain}-metadata.scale.gz`, import.meta.url))
					)
				)
			)
		)
	)

const vara = lookupOf("vara")
const avail = lookupOf("avail")
const polkadotAssetHub = lookupOf("polkadot-asset-hub")
const kusamaAssetHub = lookupOf("kusama-asset-hub")

describe("era timing constants", () => {
	it("reads the babe block time, session and era length of a standalone chain", () => {
		expect(expectedBlockTimeMs(vara)).toBe(3_000)
		expect(expectedSessionTimeMs(vara)).toBe(2_400 * 3_000)
		expect(expectedEraTimeMs(vara)).toBe(6 * 2_400 * 3_000)
		expect(expectedBlockTimeMs(avail)).toBe(20_000)
		expect(expectedEraTimeMs(avail)).toBe(6 * 720 * 20_000)
	})

	it("falls back to a parachain guess on the Asset Hubs, whose timestamp minimum period is 0", () => {
		expect(expectedBlockTimeMs(polkadotAssetHub)).toBe(12_000)
		expect(expectedSessionTimeMs(kusamaAssetHub)).toBe(12_000)
	})

	it("reads the history depth and the fast unbond duration", () => {
		expect(historyDepth(polkadotAssetHub)).toBe(84)
		expect(nominatorBondingDurationEras(polkadotAssetHub, true)).toBe(28)
		expect(nominatorBondingDurationEras(polkadotAssetHub, false)).toBe(2)
		expect(nominatorBondingDurationEras(kusamaAssetHub, false)).toBe(28)
		expect(nominatorBondingDurationEras(vara, false)).toBe(14)
	})

	it("measures an Asset Hub era with the relay babe constants and the hub sessions per era", () => {
		expect(stakingEraDurationMs(vara, polkadotAssetHub)).toBe(2_400 * 3_000 * 6)
		expect(stakingErasPerYear(vara, polkadotAssetHub)).toBe(730)
		expect(stakingErasPerYear(polkadotAssetHub, polkadotAssetHub)).toBe(0)
	})
})

describe("session progress", () => {
	const indexes = { currentIndex: 1_000, activeEra: 150, erasStartSessionIndex: 996 }

	it("derives the babe era progress as polkadot.js does", () => {
		const progress = sessionProgressOf(vara, indexes, {
			currentSlot: 575_102_900n,
			epochIndex: 239_500n,
			genesisSlot: 300_000n,
		})
		expect(progress).toEqual({
			currentIndex: 1_000,
			activeEra: 150,
			sessionLength: 2_400,
			sessionsPerEra: 6,
			eraLength: 14_400,
			isEpoch: true,
			sessionProgress: 2_900,
			eraProgress: 4 * 2_400 + 2_900,
		})
	})

	it("reports no progress on an aura chain", () => {
		expect(sessionProgressOf(kusamaAssetHub, indexes, undefined)).toEqual({
			currentIndex: 1_000,
			activeEra: 150,
			sessionLength: 1,
			sessionsPerEra: 6,
			eraLength: 6,
			isEpoch: false,
			sessionProgress: 0,
			eraProgress: 0,
		})
	})

	it("counts a missing era start session as 1, like the derive", () => {
		const progress = sessionProgressOf(
			vara,
			{ ...indexes, erasStartSessionIndex: undefined },
			{ currentSlot: 575_100_000n, epochIndex: 239_500n, genesisSlot: 300_000n }
		)
		expect(progress.eraProgress).toBe(999 * 2_400)
	})

	it("turns eras into milliseconds from the chain's own block time or the relay session time", () => {
		const babe = sessionProgressOf(vara, indexes, {
			currentSlot: 575_102_900n,
			epochIndex: 239_500n,
			genesisSlot: 300_000n,
		})
		expect(eraEtaMs(1, babe, vara)).toBe((14_400 - 12_500) * 3_000)
		expect(eraEtaMs(3, babe, vara)).toBe((2 * 14_400 + 14_400 - 12_500) * 3_000)
		const aura = sessionProgressOf(kusamaAssetHub, indexes, undefined)
		expect(eraEtaMs(1, aura, vara)).toBe(6 * 2_400 * 3_000)
	})
})
