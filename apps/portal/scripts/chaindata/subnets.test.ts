import type { ChaindataFile } from "@talismn/chaindata-provider"
import { describe, expect, it } from "vitest"

import shipped from "../../src/domains/staking/subtensor/subnets.json"
import { bittensorSubnets } from "./subnets.ts"

const dtao = (netuid: number, subnetName: string | undefined, symbol: string, hotkey?: string) =>
	({
		id: `bittensor:substrate-dtao:${netuid}${hotkey ? `:${hotkey}` : ""}`,
		platform: "polkadot",
		networkId: "bittensor",
		type: "substrate-dtao",
		symbol,
		decimals: 9,
		netuid,
		subnetName,
		hotkey,
		isTransferable: true,
	}) satisfies ChaindataFile["tokens"][number]

const chaindata = (tokens: ChaindataFile["tokens"]) =>
	({ networks: [], tokens, miniMetadatas: [] }) satisfies ChaindataFile

describe("bittensorSubnets", () => {
	it("lists each Bittensor subnet once, by netuid, with its name and alpha symbol", () => {
		expect(
			bittensorSubnets(
				chaindata([
					dtao(2, "DSperse", "β"),
					dtao(46, "Resi", "ש"),
					dtao(46, "Resi", "ש", "5DXdHixxtCvoa6GHKs2Jgrdzc61882Ftx1zN2sYFQuwgL1S1"),
					{ ...dtao(1, "Other", "α"), networkId: "bittensor-testnet" },
					dtao(0, "Root", "TAO"),
					dtao(113, undefined, "ж"),
				]),
				"bittensor"
			)
		).toEqual([
			{ netuid: 0, descriptionName: "Root", symbol: "TAO" },
			{ netuid: 2, descriptionName: "DSperse", symbol: "β" },
			{ netuid: 46, descriptionName: "Resi", symbol: "ש" },
			{ netuid: 113, descriptionName: "", symbol: "ж" },
		])
	})

	it("ships a list in that shape, sorted by unique netuid", () => {
		const netuids = shipped.map(({ netuid }) => netuid)
		expect(netuids).toEqual([...new Set(netuids)].sort((a, b) => a - b))
		expect(shipped.length).toBeGreaterThan(100)
		for (const subnet of shipped)
			expect(Object.keys(subnet).sort()).toEqual(["descriptionName", "netuid", "symbol"])
	})
})
