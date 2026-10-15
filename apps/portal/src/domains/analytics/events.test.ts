import { describe, expect, it } from "vitest"
import { track } from "./client"
import { consentKindOf, EVENTS, mergeEventGroups } from "./events"
import { evmWalletOf, substrateWalletOf } from "./events/extensions"
import {
	callOf,
	contractFunctionOf,
	evmChainOf,
	palletOf,
	substrateChainOf,
} from "./events/transactions"

describe("event catalog", () => {
	it("keeps the names of the five events the portal sent before consent", () => {
		expect(Object.keys(EVENTS)).toEqual([
			"$pageview",
			"EVM extensions connected",
			"Substrate extensions connected",
			"Report portfolio balances",
			"Extrinsic in block",
			"Write to EVM contract",
		])
	})

	it("gates every catalog event on analytics", () => {
		for (const name of Object.keys(EVENTS)) expect(consentKindOf(name)).toBe("analytics")
	})

	it.each([
		"$exception",
		"$opt_in",
		"$identify",
		"$set",
		"$web_vitals",
		"$pageleave",
		"toString",
		"custom",
	])("gates nothing on %s", (eventName) => {
		expect(consentKindOf(eventName)).toBeUndefined()
	})

	it("lists route patterns, not URLs, as $pageview routes", () => {
		expect(EVENTS.$pageview.properties.route.values).toContain("/portfolio/:rest")
		expect(EVENTS.$pageview.properties.route.values).not.toContain("/portfolio/$")
	})

	it("rejects two groups that name the same event", () => {
		const viewed = { description: "Viewed", properties: {} }
		expect(() =>
			// @ts-expect-error
			mergeEventGroups({ page_viewed: viewed }, { page_viewed: viewed })
		).toThrow('Duplicate analytics event "page_viewed"')
	})

	it("types event props from the catalog, so an address, a hash or free text cannot be passed", () => {
		const address: string = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
		track("$pageview", { route: "/staking/providers" })
		track("Substrate extensions connected", { wallet: "talisman" })
		track("Extrinsic in block", { chain: "astar", module: "dappStaking", section: "stake" })
		// @ts-expect-error
		track("$pageview", { route: "/portfolio/5GrwvaEF" })
		// @ts-expect-error
		track("$pageview")
		// @ts-expect-error
		track("custom_event", {})
		// @ts-expect-error
		track("Substrate extensions connected", { wallet: address })
		// @ts-expect-error
		track("Report portfolio balances", { tokens: 3, chains: 1, address })
		// @ts-expect-error
		track("Write to EVM contract", { chain: "Ethereum", functionName: "stake", hash: address })
	})
})

describe("catalog values", () => {
	it.each([
		[substrateChainOf("polkadot-asset-hub"), "polkadot-asset-hub"],
		[substrateChainOf("rococo"), "other"],
		[substrateChainOf(undefined), "other"],
		[palletOf("nominationPools"), "nominationPools"],
		[palletOf("democracy"), "other"],
		[callOf("batchAll"), "batchAll"],
		[callOf("transferAll"), "other"],
		[substrateWalletOf("subwallet-js"), "subwallet-js"],
		[substrateWalletOf("my-wallet"), "other"],
		[evmWalletOf("xyz.talisman"), "xyz.talisman"],
		[evmWalletOf("com.example.wallet"), "other"],
		[contractFunctionOf("requestWithdrawal"), "requestWithdrawal"],
		[contractFunctionOf("transferFrom"), "other"],
		[evmChainOf(1), "Ethereum"],
		[evmChainOf(1284), "Moonbeam"],
		[evmChainOf(11155111), "other"],
		[evmChainOf(undefined), "other"],
	])("maps to %s", (value, expected) => {
		expect(value).toBe(expected)
	})
})
