import type { ChaindataFile } from "@talismn/chaindata-provider"
import { describe, expect, it } from "vitest"

import { trimChaindata } from "./trim.ts"

const network = (id: string, rpcs: string[]) =>
	({
		id,
		name: id,
		nativeTokenId: `${id}:substrate-native`,
		nativeCurrency: { decimals: 10, symbol: "TKN", name: id },
		genesisHash: "0x00",
		platform: "polkadot",
		chainName: id,
		specName: id,
		specVersion: 1,
		account: "*25519",
		prefix: 0,
		rpcs,
		topology: { type: "standalone" },
	}) satisfies ChaindataFile["networks"][number]

const token = (networkId: string, symbol: string, type = "substrate-native") =>
	({
		id: type === "substrate-native" ? `${networkId}:substrate-native` : `${networkId}:${symbol}`,
		networkId,
		decimals: 10,
		symbol,
		type: "substrate-native",
		platform: "polkadot",
		existentialDeposit: "0",
	}) satisfies ChaindataFile["tokens"][number]

const miniMetadata = (chainId: string) =>
	({
		id: `${chainId}-metadata`,
		source: "substrate-native",
		chainId,
		specVersion: 1,
		version: "v14",
		data: null,
		extra: null,
	}) satisfies ChaindataFile["miniMetadatas"][number]

const chaindata: ChaindataFile = {
	networks: [
		network("polkadot-asset-hub", [
			"wss://sys.ibp.network/statemint",
			"wss://polkadot-asset-hub-rpc.polkadot.io",
		]),
		network("avail", ["wss://avail.api.onfinality.io/ws?apikey=secret", "wss://avail.rpc"]),
		network("bittensor", ["wss://lite.chain.opentensor.ai"]),
		network("moonbeam", ["wss://wss.api.moonbeam.network"]),
	],
	tokens: [
		token("polkadot-asset-hub", "DOT"),
		token("polkadot-asset-hub", "USDT", "substrate-assets"),
		token("avail", "AVAIL"),
		token("bittensor", "TAO"),
		token("bittensor", "SN1", "substrate-dtao"),
		token("moonbeam", "GLMR"),
	],
	miniMetadatas: [
		miniMetadata("polkadot-asset-hub"),
		miniMetadata("avail"),
		miniMetadata("bittensor"),
		miniMetadata("moonbeam"),
	],
}

const portalNetworks = {
	"polkadot-asset-hub": { rpc: "wss://polkadot-asset-hub-rpc.polkadot.io" },
	avail: {},
	bittensor: { tokens: ["bittensor:SN1"] },
}

describe("trimChaindata", () => {
	it("keeps only the portal networks and their miniMetadatas", () => {
		const trimmed = trimChaindata(chaindata, portalNetworks)

		expect(trimmed.networks.map(({ id }) => id)).toEqual([
			"polkadot-asset-hub",
			"avail",
			"bittensor",
		])
		expect(trimmed.miniMetadatas.map(({ chainId }) => chainId)).toEqual([
			"polkadot-asset-hub",
			"avail",
			"bittensor",
		])
	})

	it("keeps each network's native token and the tokens it lists", () => {
		const trimmed = trimChaindata(chaindata, portalNetworks)

		expect(trimmed.tokens.map(({ id }) => id)).toEqual([
			"polkadot-asset-hub:substrate-native",
			"avail:substrate-native",
			"bittensor:substrate-native",
			"bittensor:SN1",
		])
	})

	it("puts the portal rpc first without repeating it", () => {
		const [polkadotAssetHub] = trimChaindata(chaindata, portalNetworks).networks

		expect(polkadotAssetHub?.rpcs).toEqual([
			"wss://polkadot-asset-hub-rpc.polkadot.io",
			"wss://sys.ibp.network/statemint",
		])
	})

	it("drops rpcs that carry an api key", () => {
		const [, avail] = trimChaindata(chaindata, portalNetworks).networks

		expect(avail?.rpcs).toEqual(["wss://avail.rpc"])
	})

	it("gives a native token its network's logo when the portal asks for it", () => {
		const withLogos: ChaindataFile = {
			...chaindata,
			networks: chaindata.networks.map((network) => ({
				...network,
				logo: `https://logo/chains/${network.id}.svg`,
			})),
			tokens: chaindata.tokens.map((token) => ({ ...token, logo: "https://logo/coingecko.webp" })),
		}

		const trimmed = trimChaindata(withLogos, {
			...portalNetworks,
			avail: { networkLogoForNativeToken: true },
		})

		expect(trimmed.tokens.map(({ id, logo }) => [id, logo])).toEqual([
			["polkadot-asset-hub:substrate-native", "https://logo/coingecko.webp"],
			["avail:substrate-native", "https://logo/chains/avail.svg"],
			["bittensor:substrate-native", "https://logo/coingecko.webp"],
			["bittensor:SN1", "https://logo/coingecko.webp"],
		])
	})

	it("throws when a portal network is missing from chaindata", () => {
		expect(() => trimChaindata(chaindata, { ...portalNetworks, mythos: {} })).toThrow(
			"Networks missing from chaindata: mythos"
		)
	})

	it("throws when a listed token is missing from chaindata", () => {
		expect(() =>
			trimChaindata(chaindata, { ...portalNetworks, avail: { tokens: ["avail:USDC"] } })
		).toThrow("Tokens missing from chaindata: avail:USDC")
	})
})
