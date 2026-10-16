// @vitest-environment node
import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"
import { getLookupFn } from "@polkadot-api/metadata-builders"
import { decAnyMetadata, unifyMetadata } from "@polkadot-api/substrate-bindings"
import { toHex } from "@polkadot-api/utils"
import { describe, expect, it } from "vitest"

import { callEncoderOf } from "@/domains/chains/chain-runtime"
import { loadPjsOracle } from "@/test/pjs-oracle"

import {
	bondExtraCall,
	bondRewardsCall,
	type ClaimPermission,
	claimPayoutCall,
	joinCall,
	setClaimPermissionCall,
	unbondCall,
	withdrawUnbondedCall,
} from "./calls"

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
		gunzipSync(readFileSync(new URL(`./fixtures/${chain}-metadata.scale.gz`, import.meta.url)))
	)
	const encode = callEncoderOf(getLookupFn(unifyMetadata(decAnyMetadata(metadata))))
	return {
		chain,
		papi: (call: Parameters<typeof encode>[0]) => toHex(encode(call)),
	}
}

const chains = CHAINS.map(loadChain)

const pjsHex = loadPjsOracle(new URL("./fixtures/calls.pjs.json.gz", import.meta.url))

const ADDRESSES = [
	"5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP",
	"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
]
const AMOUNTS = [0n, 1n, 1_000_000n, 10_000_000_000n, 36_340_000_000n, 2n ** 64n - 1n, 2n ** 127n]
const POOL_IDS = [0, 1, 8, 15, 282, 360, 65_535, 2 ** 32 - 1]
const SPANS = [0, 1, 2, 5, 2 ** 32 - 1]
const PERMISSIONS: ClaimPermission[] = [
	"Permissioned",
	"PermissionlessCompound",
	"PermissionlessWithdraw",
	"PermissionlessAll",
]

it("encodes the Kusama Asset Hub smoke flows as the lane recorded them on main", () => {
	const kusamaAssetHub = chains.find(({ chain }) => chain === "kusama-asset-hub")!
	expect(kusamaAssetHub.papi(bondExtraCall(1_000_000_000n))).toBe(
		"0x50010000ca9a3b000000000000000000000000"
	)
	expect(kusamaAssetHub.papi(claimPayoutCall())).toBe("0x5002")
})

describe.each(chains)("nomination pool calls on $chain", ({ chain, papi }) => {
	it.each(
		AMOUNTS.flatMap((amount) =>
			POOL_IDS.flatMap((poolId) =>
				PERMISSIONS.map((permission) => [amount, poolId, permission] as const)
			)
		)
	)("joins pool %i with %s and %s like main", (amount, poolId, permission) => {
		expect(papi(joinCall(amount, poolId, permission))).toBe(
			pjsHex(chain, "join", amount, poolId, permission)
		)
	})

	it.each(AMOUNTS)("bonds %s more from the free balance like main", (amount) => {
		expect(papi(bondExtraCall(amount))).toBe(pjsHex(chain, "bondExtra", amount))
	})

	it("re-stakes the rewards like main", () => {
		expect(papi(bondRewardsCall())).toBe(pjsHex(chain, "bondRewards"))
	})

	it("claims the payout like main", () => {
		expect(papi(claimPayoutCall())).toBe(pjsHex(chain, "claimPayout"))
	})

	it.each(ADDRESSES.flatMap((address) => AMOUNTS.map((points) => [address, points] as const)))(
		"unbonds %s points of %s like main",
		(address, points) => {
			expect(papi(unbondCall(address, points))).toBe(pjsHex(chain, "unbond", address, points))
		}
	)

	it.each(ADDRESSES.flatMap((address) => SPANS.map((spans) => [address, spans] as const)))(
		"withdraws unbonded for %s with %i slashing spans like main",
		(address, spans) => {
			expect(papi(withdrawUnbondedCall(address, spans))).toBe(
				pjsHex(chain, "withdrawUnbonded", address, spans)
			)
		}
	)

	it.each(PERMISSIONS)("sets the claim permission %s like main", (permission) => {
		expect(papi(setClaimPermissionCall(permission))).toBe(
			pjsHex(chain, "setClaimPermission", permission)
		)
	})
})
