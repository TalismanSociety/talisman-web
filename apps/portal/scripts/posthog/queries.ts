import { PRODUCTION_HOSTS } from "../../src/domains/analytics/environment"

export type PropertyFilter = {
	readonly key: string
	readonly type: "event"
	readonly operator: string
	readonly value?: readonly (string | number | boolean)[]
}

export const TEST_ACCOUNT_FILTERS: readonly PropertyFilter[] = [
	{ key: "$host", type: "event", operator: "exact", value: [...PRODUCTION_HOSTS] },
]

const DEFAULT_DATE_FROM = "-30d"

type JsonObject = { readonly [key: string]: unknown }
type Source = JsonObject & { readonly kind: string }
export type VizQuery = { readonly kind: "InsightVizNode"; readonly source: Source }
export type SqlQuery = JsonObject & {
	readonly kind: "DataVisualizationNode"
	readonly source: Source & { readonly kind: "HogQLQuery"; readonly query: string }
}
export type Query = VizQuery | SqlQuery

type Math = "total" | "dau" | "unique_session"

export type EventsNode = {
	readonly kind: "EventsNode"
	readonly event: string | null
	readonly name: string
	readonly math?: Math
	readonly custom_name?: string
	readonly properties?: readonly PropertyFilter[]
}

const dateRange = () => ({ date_from: DEFAULT_DATE_FROM, date_to: null })

export const prop = (key: string, value: string | number | boolean): PropertyFilter => ({
	key,
	type: "event",
	operator: "exact",
	value: [value],
})

export const unset = (key: string): PropertyFilter => ({
	key,
	type: "event",
	operator: "is_not_set",
})

type EvOptions = {
	readonly math?: Math
	readonly name?: string
	readonly properties?: readonly PropertyFilter[]
}

export const ev = (event: string | null, opts: EvOptions = {}): EventsNode => ({
	kind: "EventsNode",
	event,
	name: event ?? "All events",
	math: opts.math ?? "total",
	...(opts.name && { custom_name: opts.name }),
	...(opts.properties?.length && { properties: opts.properties }),
})

export const sessions = (event: string | null, opts: Omit<EvOptions, "math"> = {}) =>
	ev(event, { ...opts, math: "unique_session" })

export const visitors = (event: string | null, opts: Omit<EvOptions, "math"> = {}) =>
	ev(event, { ...opts, math: "dau" })

const breakdownFilter = (property: string, limit?: number) => ({
	breakdown: property,
	breakdown_type: "event",
	...(limit && { breakdown_limit: limit }),
})

const viz = (source: Source): VizQuery => ({ kind: "InsightVizNode", source })

type TrendOptions = {
	readonly series: readonly EventsNode[]
	readonly display?: string
	readonly breakdown?: string
	readonly breakdownLimit?: number
	readonly formula?: string
	readonly compare?: boolean
}

export const trend = (o: TrendOptions): VizQuery =>
	viz({
		kind: "TrendsQuery",
		dateRange: dateRange(),
		interval: "day",
		series: o.series,
		properties: [],
		filterTestAccounts: true,
		trendsFilter: {
			display: o.display ?? "ActionsLineGraph",
			...(o.formula && { formulaNodes: [{ formula: o.formula }] }),
		},
		...(o.compare && { compareFilter: { compare: true } }),
		...(o.breakdown && { breakdownFilter: breakdownFilter(o.breakdown, o.breakdownLimit) }),
	})

export const hogql = (sql: string): SqlQuery => {
	if (!sql.includes("{filters}")) throw new Error(`SQL without {filters}:\n${sql}`)
	return {
		kind: "DataVisualizationNode",
		source: {
			kind: "HogQLQuery",
			query: sql.trim(),
			filters: { dateRange: dateRange(), filterTestAccounts: true },
		},
		display: "ActionsTable",
	}
}

export const withTestAccountFilter = (query: Query, enabled: boolean): Query =>
	query.kind === "InsightVizNode"
		? { ...query, source: { ...query.source, filterTestAccounts: enabled } }
		: {
				...query,
				source: {
					...query.source,
					filters: { ...(query.source["filters"] as JsonObject), filterTestAccounts: enabled },
				},
			}

export const withInlineTestAccountFilter = (query: Query): Query =>
	query.kind === "InsightVizNode"
		? {
				...query,
				source: {
					...query.source,
					filterTestAccounts: false,
					properties: [
						...((query.source["properties"] as PropertyFilter[]) ?? []),
						...TEST_ACCOUNT_FILTERS,
					],
				},
			}
		: {
				...query,
				source: {
					...query.source,
					filters: {
						...(query.source["filters"] as JsonObject),
						filterTestAccounts: false,
						properties: TEST_ACCOUNT_FILTERS,
					},
				},
			}

export const sqlString = (value: string) =>
	`'${value.replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`
