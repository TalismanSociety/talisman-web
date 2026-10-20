import { describe, expect, it } from "vitest"
import shippedChaindata from "@/domains/chains/chaindata.json"
import { PORTAL_NETWORKS } from "@/domains/chains/portal-networks"
import { isCatalogValue } from "../events"
import { PORTFOLIO_CHAINS, PORTFOLIO_SYMBOLS, portfolioReportOf } from "./portfolio"

describe("portfolio enums", () => {
	it("lists every symbol of the shipped chaindata", () => {
		expect([...PORTFOLIO_SYMBOLS].sort()).toEqual(
			[...new Set(shippedChaindata.tokens.map(({ symbol }) => symbol))].sort()
		)
	})

	it("lists every network the portal ships", () => {
		expect([...PORTFOLIO_CHAINS].sort()).toEqual(Object.keys(PORTAL_NETWORKS).sort())
		expect([...PORTFOLIO_CHAINS].sort()).toEqual(
			shippedChaindata.networks.map(({ id }) => id).sort()
		)
	})
})

describe("portfolioReportOf", () => {
	it("reports held symbols, networks, the total bucket and a bucket per symbol", () => {
		const report = portfolioReportOf([
			{ symbol: "DOT", networkId: "polkadot", usd: 40 },
			{ symbol: "DOT", networkId: "polkadot-asset-hub", usd: 70 },
			{ symbol: "TAO", networkId: "bittensor", usd: 2_500 },
			{ symbol: "WND", networkId: "westend-testnet", usd: 0 },
		])

		expect(report).toEqual({
			symbols: ["DOT", "TAO", "WND"],
			chains: ["bittensor", "polkadot", "polkadot-asset-hub", "westend-testnet"],
			total_usd: "1k-10k",
			usd_dot: "100-1k",
			usd_tao: "1k-10k",
			usd_wnd: "<10",
		})
	})

	it("folds unknown symbols and networks into other, and counts them in the total only", () => {
		const report = portfolioReportOf([
			{ symbol: "SHADYCOIN", networkId: "1", usd: 50_000 },
			{ symbol: undefined, networkId: "0xdeadbeef", usd: 60_000 },
		])

		expect(report).toEqual({ symbols: ["other"], chains: ["1", "other"], total_usd: "100k+" })
	})

	it("reports an empty portfolio", () => {
		expect(portfolioReportOf([])).toEqual({ symbols: [], chains: [], total_usd: "<10" })
	})

	it("builds only values the catalog accepts", () => {
		const report = portfolioReportOf([
			{ symbol: "stETH", networkId: "1", usd: 12 },
			{ symbol: "KSM", networkId: "kusama", usd: 1_000_000 },
		])

		for (const [key, value] of Object.entries(report))
			expect(isCatalogValue("Report portfolio balances", key, value)).toBe(true)
		expect(report).toMatchObject({ usd_steth: "10-100", usd_ksm: "100k+" })
	})
})
