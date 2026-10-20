import type { ChaindataFile } from "@talismn/chaindata-provider"
import { firstValueFrom } from "rxjs"
import { expect, it, vi } from "vitest"

import { chaindataUrl, networksById$ } from "./chaindata-provider"

const chaindata: ChaindataFile = {
	networks: [
		{
			id: "portal-test",
			name: "Portal Test",
			platform: "polkadot",
			nativeTokenId: "portal-test:substrate-native",
			nativeCurrency: { decimals: 10, symbol: "TST", name: "Test" },
			genesisHash: `0x${"11".repeat(32)}`,
			chainName: "Portal Test",
			specName: "portal-test",
			specVersion: 1,
			account: "*25519",
			prefix: 42,
			rpcs: ["wss://rpc.portal.test"],
			topology: { type: "standalone" },
		},
	],
	tokens: [
		{
			id: "portal-test:substrate-native",
			platform: "polkadot",
			networkId: "portal-test",
			type: "substrate-native",
			symbol: "TST",
			decimals: 10,
			name: "Test",
			existentialDeposit: "1",
		},
	],
	miniMetadatas: [],
}

it("loads chaindata from the app's own origin only", async () => {
	const fetch = vi.fn(async (input: RequestInfo | URL) =>
		String(input) === chaindataUrl()
			? new Response(JSON.stringify(chaindata))
			: new Response(null, { status: 404 })
	)
	vi.stubGlobal("fetch", fetch)

	const networks = await firstValueFrom(networksById$)

	expect(Object.keys(networks)).toEqual(["portal-test"])
	expect(fetch.mock.calls.map(([input]) => new URL(String(input)).origin)).toEqual([
		location.origin,
	])
})
