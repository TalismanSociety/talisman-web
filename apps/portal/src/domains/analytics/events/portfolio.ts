import type { EventGroup } from "../events"
import {
	optional,
	type PropertyValues,
	p,
	parseEnum,
	USD_BUCKETS,
	type UsdBucket,
	usdBucketOf,
} from "../properties"

export const PORTFOLIO_SYMBOLS = [
	"ANLOG",
	"ASTR",
	"AVAIL",
	"CERE",
	"DOT",
	"ETH",
	"KSM",
	"TAO",
	"VARA",
	"WND",
	"stETH",
] as const

export type PortfolioSymbol = (typeof PORTFOLIO_SYMBOLS)[number]

const SYMBOL_BUCKET_KEYS = {
	ANLOG: "usd_anlog",
	ASTR: "usd_astr",
	AVAIL: "usd_avail",
	CERE: "usd_cere",
	DOT: "usd_dot",
	ETH: "usd_eth",
	KSM: "usd_ksm",
	TAO: "usd_tao",
	VARA: "usd_vara",
	WND: "usd_wnd",
	stETH: "usd_steth",
} as const satisfies { [S in PortfolioSymbol]: `usd_${Lowercase<S>}` }

export const PORTFOLIO_CHAINS = [
	"1",
	"analog-timechain",
	"astar",
	"avail",
	"bittensor",
	"cere",
	"kusama",
	"kusama-asset-hub",
	"polkadot",
	"polkadot-asset-hub",
	"vara",
	"westend-testnet",
] as const

const SYMBOLS = [...PORTFOLIO_SYMBOLS, "other"] as const

const CHAINS = [...PORTFOLIO_CHAINS, "other"] as const

const portfolioSymbolOf = parseEnum(SYMBOLS, "other")

const portfolioChainOf = parseEnum(CHAINS, "other")

const symbolBucket = (symbol: PortfolioSymbol) =>
	optional(p.enum(USD_BUCKETS, `USD value held in ${symbol}, as a bucket`))

export const portfolioEvents = {
	"Report portfolio balances": {
		description: "The user's own accounts' balances loaded, once per page load",
		properties: {
			symbols: p.enumList(SYMBOLS, "Token symbols held, from the shipped chaindata"),
			chains: p.enumList(CHAINS, "Networks with a balance, from the shipped chaindata"),
			total_usd: p.enum(USD_BUCKETS, "Total USD value held, as a bucket"),
			usd_anlog: symbolBucket("ANLOG"),
			usd_astr: symbolBucket("ASTR"),
			usd_avail: symbolBucket("AVAIL"),
			usd_cere: symbolBucket("CERE"),
			usd_dot: symbolBucket("DOT"),
			usd_eth: symbolBucket("ETH"),
			usd_ksm: symbolBucket("KSM"),
			usd_tao: symbolBucket("TAO"),
			usd_vara: symbolBucket("VARA"),
			usd_wnd: symbolBucket("WND"),
			usd_steth: symbolBucket("stETH"),
		},
	},
} as const satisfies EventGroup

type PortfolioReport = PropertyValues<
	(typeof portfolioEvents)["Report portfolio balances"]["properties"]
>

export type Holding = { symbol: string | undefined; networkId: string; usd: number }

export const portfolioReportOf = (holdings: readonly Holding[]): PortfolioReport => {
	const usdBySymbol = new Map<string, number>()
	const chains = new Set<string>()
	for (const { symbol, networkId, usd } of holdings) {
		const known = portfolioSymbolOf(symbol)
		usdBySymbol.set(known, (usdBySymbol.get(known) ?? 0) + usd)
		chains.add(portfolioChainOf(networkId))
	}
	const symbolBuckets: Partial<Record<(typeof SYMBOL_BUCKET_KEYS)[PortfolioSymbol], UsdBucket>> = {}
	for (const symbol of PORTFOLIO_SYMBOLS) {
		const usd = usdBySymbol.get(symbol)
		if (usd !== undefined) symbolBuckets[SYMBOL_BUCKET_KEYS[symbol]] = usdBucketOf(usd)
	}
	return {
		symbols: SYMBOLS.filter((symbol) => usdBySymbol.has(symbol)),
		chains: CHAINS.filter((chain) => chains.has(chain)),
		total_usd: usdBucketOf(holdings.reduce((total, { usd }) => total + usd, 0)),
		...symbolBuckets,
	}
}
