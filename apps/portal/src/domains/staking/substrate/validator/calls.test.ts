// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { describe, expect, it } from "vitest"

import { callEncoderOf } from "@/domains/chains/chain-runtime"
import { loadPjsOracle } from "@/test/pjs-oracle"

import { unbondActionCall, unbondAllCall, unbondCall, withdrawUnbondedCall } from "./calls"

const CHAINS = [
	"polkadot-asset-hub",
	"kusama-asset-hub",
	"analog-timechain",
	"vara",
	"avail",
	"cere",
]

const loadChain = (chain: string) => {
	const metadata = new Uint8Array(
		gunzipSync(
			readFileSync(
				new URL(`../nominationPools/fixtures/${chain}-metadata.scale.gz`, import.meta.url)
			)
		)
	)
	const encode = callEncoderOf(getLookupFn(unifyMetadata(decAnyMetadata(metadata))))
	return {
		chain,
		papi: (call: Parameters<typeof encode>[0]) => toHex(encode(call)),
	}
}

const chains = CHAINS.map(loadChain)

const pjsHex = loadPjsOracle(new URL("./fixtures/calls.pjs.json.gz", import.meta.url))

const AMOUNTS = [
	0n,
	1n,
	1_000_000_000n,
	10_000_000_000n,
	106_411_612_961n,
	2n ** 64n - 1n,
	2n ** 127n,
]
const SPANS = [0, 1, 2, 5, 2 ** 32 - 1]

it("encodes the Kusama Asset Hub unbond the smoke lane recorded on main", () => {
	const kusamaAssetHub = chains.find(({ chain }) => chain === "kusama-asset-hub")!
	expect(kusamaAssetHub.papi(unbondCall(1_000_000_000n))).toBe("0x590202286bee")
})

describe.each(chains)("validator calls on $chain", ({ chain, papi }) => {
	it.each(AMOUNTS)("unbonds %s like main", (value) => {
		expect(papi(unbondCall(value))).toBe(pjsHex(chain, "unbond", value))
	})

	it.each(AMOUNTS)("chills and unbonds the whole active stake of %s like main", (active) => {
		expect(papi(unbondAllCall(active))).toBe(pjsHex(chain, "unbondAll", active))
	})

	it.each(SPANS)("withdraws unbonded with %i slashing spans like main", (spans) => {
		expect(papi(withdrawUnbondedCall(spans))).toBe(pjsHex(chain, "withdrawUnbonded", spans))
	})

	it("routes the dialog's two actions to the two shapes", () => {
		expect(papi(unbondActionCall({ type: "unbond", value: 5n }))).toBe(
			pjsHex(chain, "unbondAction", "unbond", 5n)
		)
		expect(papi(unbondActionCall({ type: "unbondAll", active: 5n }))).toBe(
			pjsHex(chain, "unbondAction", "unbondAll", 5n)
		)
	})
})
