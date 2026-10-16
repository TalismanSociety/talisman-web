import { ChaindataFileSchema } from "@talismn/chaindata-provider"
import { expect, it } from "vitest"

import chaindata from "../../../public/chaindata.json"
import { PORTAL_NETWORKS } from "./portal-networks"

const parsed = ChaindataFileSchema.parse(chaindata)

it("ships exactly the portal networks", () => {
	expect(parsed.networks.map(({ id }) => id).sort()).toEqual(Object.keys(PORTAL_NETWORKS).sort())
})

it("ships each network's portal rpc first", () => {
	const firstRpcs = new Map(parsed.networks.map(({ id, rpcs }) => [id, rpcs[0]]))
	const portalRpcs = Object.entries(PORTAL_NETWORKS).flatMap(([id, network]) =>
		"rpc" in network ? [[id, network.rpc] as const] : []
	)

	expect(portalRpcs.length).toBeGreaterThan(0)
	for (const [id, rpc] of portalRpcs) expect(firstRpcs.get(id)).toBe(rpc)
})

it("ships no rpc carrying an api key", () => {
	const rpcs = parsed.networks.flatMap(({ rpcs }) => rpcs)

	expect(rpcs.filter((rpc) => /apikey=|\/pk_|\/vk_/i.test(rpc))).toEqual([])
})

it("ships every network's native token", () => {
	const tokenIds = new Set(parsed.tokens.map(({ id }) => id))

	expect(parsed.networks.filter(({ nativeTokenId }) => !tokenIds.has(nativeTokenId))).toEqual([])
})
