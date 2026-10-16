import { PORTFOLIO_SYMBOLS } from "../../src/domains/analytics/events/portfolio"
import { USD_BUCKETS } from "../../src/domains/analytics/properties"
import { type CatalogSnapshot, EXCEPTION_EVENT } from "./catalog"
import {
	type EventsNode,
	ev,
	hogql,
	type PropertyFilter,
	type Query,
	sessions,
	sqlString,
	TEST_ACCOUNT_FILTERS,
	trend,
	unset,
	visitors,
	withTestAccountFilter,
} from "./queries"

export type Tile = {
	readonly name: string
	readonly description: string
	readonly query: Query
	readonly size?: "quarter" | "third" | "half" | "full"
	readonly allEnvironments?: true
}

export type Dashboard = {
	readonly slug: string
	readonly title: string
	readonly prefix: string
	readonly description: string
	readonly tiles: readonly Tile[]
}

export type Alert = {
	readonly name: string
	readonly tile: string
	readonly seriesIndex: number
	readonly condition: "absolute_value" | "relative_increase" | "relative_decrease"
	readonly threshold: {
		readonly type: "absolute" | "percentage"
		readonly lower?: number
		readonly upper?: number
	}
	readonly interval: "hourly" | "daily" | "weekly"
}

export const filtersTestAccounts = (tile: Tile, filterTestAccounts: boolean) =>
	filterTestAccounts && !tile.allEnvironments

export const tileQuery = (tile: Tile, filterTestAccounts: boolean): Query =>
	withTestAccountFilter(tile.query, filtersTestAccounts(tile, filterTestAccounts))

const PRODUCTION_ONLY = "Production only, unless the test-account filter is off."

const EXCEPTIONS_TILE = "Exceptions"

const PORTFOLIO_EVENT = "Report portfolio balances"
const EXTRINSIC_EVENT = "Extrinsic in block"
const CONTRACT_EVENT = "Write to EVM contract"
const EVM_CONNECTED = "EVM extensions connected"
const SUBSTRATE_CONNECTED = "Substrate extensions connected"

const eventsTile = (
	name: string,
	description: string,
	events: readonly string[],
	opts: { breakdown?: string; size?: Tile["size"]; properties?: readonly PropertyFilter[] } = {}
): Tile => ({
	name,
	description,
	size: opts.size ?? "half",
	query: trend({
		series: events.map((event) => ev(event, { properties: opts.properties })),
		...(opts.breakdown && { breakdown: opts.breakdown, display: "ActionsBarValue" }),
	}),
})

const heldTile = (name: string, description: string, property: string, column: string): Tile => ({
	name,
	description,
	size: "half",
	query: hogql(`
SELECT ${column}, uniq(distinct_id) AS visitors, count() AS reports
FROM events
ARRAY JOIN JSONExtract(ifNull(properties.${property}, '[]'), 'Array(String)') AS ${column}
WHERE event = ${sqlString(PORTFOLIO_EVENT)} AND {filters}
GROUP BY ${column}
ORDER BY visitors DESC`),
})

const symbolValueTile = (): Tile => {
	const pairs = PORTFOLIO_SYMBOLS.map(
		(symbol) => `(${sqlString(symbol)}, properties.usd_${symbol.toLowerCase()})`
	)
	const columns = USD_BUCKETS.map(
		(bucket) => `countIf(tupleElement(held, 2) = ${sqlString(bucket)}) AS \`${bucket}\``
	)
	return {
		name: "Value held by symbol",
		description:
			"Reports (events) holding each token symbol, by the USD value held in it, bucketed: one column per bucket.",
		size: "full",
		query: hogql(`
SELECT tupleElement(held, 1) AS symbol, ${columns.join(", ")}
FROM events
ARRAY JOIN [${pairs.join(", ")}] AS held
WHERE event = ${sqlString(PORTFOLIO_EVENT)} AND tupleElement(held, 2) IS NOT NULL AND {filters}
GROUP BY symbol
ORDER BY symbol`),
	}
}

const errorsPerSession: Tile = {
	name: "Exceptions per session",
	description:
		"Exceptions (events) divided by sessions ($session_id) that sent any event, per day. Exceptions need the Error reporting consent and other events the Analytics consent, so the ratio is an estimate.",
	size: "half",
	query: trend({
		series: [ev(EXCEPTION_EVENT, { name: "Exceptions" }), sessions(null, { name: "Sessions" })],
		formula: "A / B",
	}),
}

export const DASHBOARDS: readonly Dashboard[] = [
	{
		slug: "overview",
		title: "Overview",
		prefix: "Overview",
		description: `Visitors, sessions and pages of the portal. A visitor is a distinct_id: one browser under Analytics consent. A session is a $session_id. No person is ever created. ${PRODUCTION_ONLY}`,
		tiles: [
			{
				name: "Sessions",
				description:
					"Sessions ($session_id) that sent any event over the date range, with the change from the previous period.",
				size: "third",
				query: trend({
					series: [sessions(null, { name: "Sessions" })],
					display: "BoldNumber",
					compare: true,
				}),
			},
			{
				name: "Visitors",
				description:
					"Visitors (unique distinct_id, one per browser) over the date range, with the change from the previous period.",
				size: "third",
				query: trend({
					series: [visitors(null, { name: "Visitors" })],
					display: "BoldNumber",
					compare: true,
				}),
			},
			{
				name: "Pageviews",
				description:
					"Pageviews (events) over the date range, with the change from the previous period.",
				size: "third",
				query: trend({
					series: [ev("$pageview", { name: "Pageviews" })],
					display: "BoldNumber",
					compare: true,
				}),
			},
			{
				name: "Daily visitors and sessions",
				description:
					"Visitors (unique distinct_id) and sessions ($session_id) that sent any event, per day.",
				size: "full",
				query: trend({
					series: [visitors(null, { name: "Visitors" }), sessions(null, { name: "Sessions" })],
				}),
			},
			{
				name: "Pageviews by route",
				description:
					"Pageviews (events) by route pattern, with ids left out. Builds from before the consent banner send no route.",
				size: "half",
				query: trend({
					series: [ev("$pageview", { name: "Pageviews" })],
					breakdown: "route",
					breakdownLimit: 25,
					display: "ActionsBarValue",
				}),
			},
			{
				name: "Pageviews by environment",
				description:
					"Pageviews (events) per day by environment, whatever the test-account filter: production, preview Workers and localhost. Builds from before the consent banner send no environment.",
				size: "half",
				allEnvironments: true,
				query: trend({
					series: [ev("$pageview", { name: "Pageviews" })],
					breakdown: "environment",
					display: "ActionsAreaGraph",
				}),
			},
			{
				name: "Top events",
				description:
					"The most frequent events: events sent and the sessions ($session_id) that sent them.",
				size: "full",
				query: hogql(`
SELECT event, count() AS events, uniq($session_id) AS sessions
FROM events
WHERE {filters}
GROUP BY event
ORDER BY events DESC
LIMIT 50`),
			},
		],
	},
	{
		slug: "wallets",
		title: "Wallets",
		prefix: "Wallets",
		description: `Wallet extension connections: which Polkadot and Ethereum wallets visitors connect. ${PRODUCTION_ONLY}`,
		tiles: [
			{
				name: "Visitors connecting a wallet",
				description:
					"Visitors (unique distinct_id) per day that connected a Polkadot or an Ethereum wallet.",
				size: "full",
				query: trend({
					series: [
						visitors(SUBSTRATE_CONNECTED, { name: "Polkadot" }),
						visitors(EVM_CONNECTED, { name: "Ethereum" }),
					],
				}),
			},
			eventsTile(
				"Polkadot wallets",
				"Polkadot extension connections (events), by wallet, or other for an unlisted one.",
				[SUBSTRATE_CONNECTED],
				{ breakdown: "wallet" }
			),
			eventsTile(
				"Ethereum wallets",
				"Ethereum connection changes (events), by the wallet of the newest connection: its EIP-6963 id, or other.",
				[EVM_CONNECTED],
				{ breakdown: "wallet" }
			),
			eventsTile(
				"Ethereum connections held",
				"Ethereum connection changes (events), by connections: the number of Ethereum wallets connected at once.",
				[EVM_CONNECTED],
				{ breakdown: "connections" }
			),
		],
	},
	{
		slug: "portfolio",
		title: "Portfolio",
		prefix: "Portfolio",
		description: `What visitors hold, from the one portfolio report per page load: held symbols and networks, and USD values as buckets. No address or amount is sent. ${PRODUCTION_ONLY}`,
		tiles: [
			eventsTile(
				"Total value",
				"Portfolio reports (events) by total_usd: the USD value of the user's own accounts, bucketed.",
				[PORTFOLIO_EVENT],
				{ breakdown: "total_usd" }
			),
			eventsTile(
				"Portfolio reports",
				"Portfolio reports (events) per day: one per page load once balances settle.",
				[PORTFOLIO_EVENT]
			),
			heldTile(
				"Held symbols",
				"Visitors (unique distinct_id) and reports (events) holding each token symbol.",
				"symbols",
				"symbol"
			),
			heldTile(
				"Networks with a balance",
				"Visitors (unique distinct_id) and reports (events) with a balance on each network.",
				"chains",
				"network"
			),
			symbolValueTile(),
		],
	},
	{
		slug: "transactions",
		title: "Transactions",
		prefix: "Transactions",
		description: `Substrate extrinsics that reached a block and Ethereum contract writes the portal built, by chain, pallet, call and function. ${PRODUCTION_ONLY}`,
		tiles: [
			eventsTile(
				"Extrinsics by chain",
				"Substrate transactions in a block (events), by chain. A batch counts once: its inner calls are left out.",
				[EXTRINSIC_EVENT],
				{ breakdown: "chain", properties: [unset("parent_module")] }
			),
			eventsTile(
				"Calls by pallet",
				"Substrate calls in a block (events), by pallet. A batch counts once for itself and once per inner call.",
				[EXTRINSIC_EVENT],
				{ breakdown: "module" }
			),
			{
				name: "Calls by pallet and call",
				description:
					"Substrate calls in a block (events) and the sessions ($session_id) that sent them, by chain, pallet and call. Inner calls of a batch name the batch's pallet and call.",
				size: "full",
				query: hogql(`
SELECT properties.chain AS chain, properties.module AS pallet, properties.section AS call, properties.parent_module AS batch_pallet, properties.parent_section AS batch_call, count() AS calls, uniq($session_id) AS sessions
FROM events
WHERE event = ${sqlString(EXTRINSIC_EVENT)} AND {filters}
GROUP BY chain, pallet, call, batch_pallet, batch_call
ORDER BY calls DESC
LIMIT 100`),
			},
			eventsTile(
				"Contract writes by chain",
				"Ethereum contract calls submitted (events), by chain.",
				[CONTRACT_EVENT],
				{ breakdown: "chain" }
			),
			eventsTile(
				"Contract writes by function",
				"Ethereum contract calls submitted (events), by contract function.",
				[CONTRACT_EVENT],
				{ breakdown: "functionName" }
			),
		],
	},
	{
		slug: "errors",
		title: "Errors",
		prefix: "Errors",
		description: `Exceptions the portal reported under the Error reporting consent. A report carries no message. ${PRODUCTION_ONLY}`,
		tiles: [
			{
				name: EXCEPTIONS_TILE,
				description:
					"Exceptions (events) reported per day in production, whatever the test-account filter. The alerts watch this tile.",
				size: "full",
				query: trend({
					series: [ev(EXCEPTION_EVENT, { name: "Exceptions", properties: TEST_ACCOUNT_FILTERS })],
				}),
			},
			errorsPerSession,
		],
	},
]

export const ALERTS: readonly Alert[] = [
	{
		name: "Exceptions doubled",
		tile: EXCEPTIONS_TILE,
		seriesIndex: 0,
		condition: "relative_increase",
		threshold: { type: "percentage", upper: 1 },
		interval: "daily",
	},
	{
		name: "More than 50 exceptions a day",
		tile: EXCEPTIONS_TILE,
		seriesIndex: 0,
		condition: "absolute_value",
		threshold: { type: "absolute", upper: 50 },
		interval: "daily",
	},
]

const dashboardNumber = (dashboards: readonly Dashboard[], spec: Dashboard) =>
	String(dashboards.indexOf(spec) + 1).padStart(2, "0")

export const dashboardName = (dashboards: readonly Dashboard[], spec: Dashboard) =>
	`${dashboardNumber(dashboards, spec)}. ${spec.title}`

export const insightName = (dashboards: readonly Dashboard[], spec: Dashboard, tile: Tile) =>
	`${dashboardNumber(dashboards, spec)}. ${spec.prefix} · ${tile.name}`

export const dashboardTitleOf = (name: string) => name.replace(/^\d+\. /, "")

export const tileNameOf = (name: string) => {
	const i = name.indexOf(" · ")
	return i === -1 ? name : name.slice(i + 3)
}

const walk = (value: unknown, visit: (node: Record<string, unknown>) => void) => {
	if (Array.isArray(value)) for (const item of value) walk(item, visit)
	else if (value && typeof value === "object") {
		visit(value as Record<string, unknown>)
		for (const child of Object.values(value)) walk(child, visit)
	}
}

const SQL_STRING = /'((?:[^'\\]|\\.)*)'/g

const SQL_EVENT_FILTER =
	/\bevent\s*(?:=\s*'([^']+)'(?!'|\s*\|\|)|in\s*\((\s*'[^']+'(?!')(?:\s*,\s*'[^']+'(?!'))*\s*)\))/gi
const SQL_EVENT_COLUMN =
	/\b(?:select|by)\s+(event)(?=\s*(?:,|$|(?:from|where|group|order|having|limit)\b))/gi
const SQL_COMMENT = /\/\*|--|\/\/|#/
const SQL_PROPERTY = /\bproperties(?:\.(\$?\w+)|\[\s*'(\$?\w+)'\s*\])/gi

type SqlReferences = {
	readonly events: readonly string[]
	readonly properties: readonly string[]
	readonly unparsed: readonly { readonly word: string; readonly at: string }[]
}

const unparsedOccurrences = (sql: string, word: string, parsedAt: ReadonlySet<number>) =>
	[...sql.matchAll(new RegExp(`\\b${word}\\b`, "gi"))]
		.filter((match) => !parsedAt.has(match.index))
		.map((match) => ({ word, at: sql.slice(match.index, match.index + 40) }))

const sqlReferences = (sql: string): SqlReferences => {
	const events: string[] = []
	const eventsAt = new Set<number>()
	for (const match of sql.matchAll(SQL_EVENT_FILTER)) {
		eventsAt.add(match.index)
		if (match[1]) events.push(match[1])
		for (const [, name] of (match[2] ?? "").matchAll(SQL_STRING)) if (name) events.push(name)
	}
	for (const match of sql.matchAll(SQL_EVENT_COLUMN))
		eventsAt.add(match.index + match[0].toLowerCase().lastIndexOf("event"))
	const properties: string[] = []
	const propertiesAt = new Set<number>()
	for (const match of sql.matchAll(SQL_PROPERTY)) {
		propertiesAt.add(match.index)
		const name = match[1] ?? match[2]
		if (name) properties.push(name)
	}
	return {
		events,
		properties,
		unparsed: [
			...unparsedOccurrences(sql, "event", eventsAt),
			...unparsedOccurrences(sql, "properties", propertiesAt),
		],
	}
}

const referencedEvents = (query: Query): Set<string> => {
	const events = new Set<string>()
	walk(query, (node) => {
		if (node["kind"] === "EventsNode" && typeof node["event"] === "string")
			events.add(node["event"])
	})
	if (query.kind === "DataVisualizationNode")
		for (const event of sqlReferences(query.source.query).events) events.add(event)
	return events
}

const referencedProperties = (query: Query): Set<string> => {
	const properties = new Set<string>()
	walk(query, (node) => {
		if (node["type"] === "event" && typeof node["key"] === "string") properties.add(node["key"])
		if (node["breakdown_type"] === "event" && typeof node["breakdown"] === "string")
			properties.add(node["breakdown"])
	})
	if (query.kind === "DataVisualizationNode")
		for (const name of sqlReferences(query.source.query).properties) properties.add(name)
	return properties
}

const POSTHOG_PROPERTIES: ReadonlySet<string> = new Set(["$session_id", "$host"])

const MAX_INSIGHT_DESCRIPTION_LENGTH = 400

const duplicates = (values: readonly string[]) => [
	...new Set(values.filter((v, i) => values.indexOf(v) !== i)),
]

const seriesOf = (query: Query) =>
	query.kind === "InsightVizNode" ? ((query.source["series"] ?? []) as readonly EventsNode[]) : []

const breakdownOf = (query: Query) =>
	(query.source["breakdownFilter"] as { breakdown?: string } | undefined)?.breakdown

const undeclaredReads = (
	tile: Tile,
	declaredBy: ReadonlyMap<string, ReadonlySet<string>>,
	isExempt: (property: string) => boolean
): string[] => {
	const declares = (event: string | null, property: string) =>
		event !== null && (declaredBy.get(event)?.has(property) ?? true)
	if (tile.query.kind === "DataVisualizationNode") {
		const events = [...referencedEvents(tile.query)]
		return [...referencedProperties(tile.query)]
			.filter((property) => !isExempt(property))
			.flatMap((property) =>
				events.length
					? events
							.filter((event) => !declares(event, property))
							.map(
								(event) =>
									`tile "${tile.name}" reads property "${property}" on "${event}", which does not declare it`
							)
					: [`tile "${tile.name}" reads property "${property}" and names no event`]
			)
	}
	const tileFilters = ((tile.query.source["properties"] ?? []) as readonly PropertyFilter[]).map(
		(filter) => filter.key
	)
	const perEvent = [breakdownOf(tile.query), ...tileFilters].flatMap((p) => p ?? [])
	return seriesOf(tile.query).flatMap((node) =>
		[...(node.properties ?? []).map((filter) => filter.key), ...perEvent]
			.filter((property) => !isExempt(property) && !declares(node.event, property))
			.map(
				(property) =>
					`tile "${tile.name}" reads property "${property}" on ${node.event === null ? "every event" : `"${node.event}"`}, which does not declare it`
			)
	)
}

export const specErrors = (
	dashboards: readonly Dashboard[],
	alerts: readonly Alert[],
	catalog: CatalogSnapshot
): string[] => {
	const tiles = dashboards.flatMap((d) => d.tiles)
	const declaredBy = new Map(catalog.events.map((e) => [e.name, new Set(e.properties)] as const))
	const properties = new Set(catalog.properties.map((p) => p.name))
	const superProperties = new Set(catalog.properties.filter((p) => p.isSuper).map((p) => p.name))
	const isExempt = (property: string) =>
		POSTHOG_PROPERTIES.has(property) || superProperties.has(property) || !properties.has(property)
	const errors: string[] = [...catalog.errors]
	for (const name of duplicates(dashboards.map((d) => d.slug)))
		errors.push(`dashboard slug "${name}" is used twice`)
	for (const name of duplicates(dashboards.map((d) => d.title)))
		errors.push(`dashboard title "${name}" is used twice`)
	for (const name of duplicates(tiles.map((t) => t.name)))
		errors.push(`tile name "${name}" is used twice`)
	for (const tile of tiles) {
		if (tile.description.length > MAX_INSIGHT_DESCRIPTION_LENGTH)
			errors.push(
				`tile "${tile.name}": description is ${tile.description.length} characters, max ${MAX_INSIGHT_DESCRIPTION_LENGTH}`
			)
		for (const event of referencedEvents(tile.query))
			if (!declaredBy.has(event))
				errors.push(`tile "${tile.name}" reads event "${event}", which the catalog does not define`)
		for (const property of referencedProperties(tile.query))
			if (!POSTHOG_PROPERTIES.has(property) && !properties.has(property))
				errors.push(
					`tile "${tile.name}" reads property "${property}", which the catalog does not define`
				)
		if (tile.query.kind === "DataVisualizationNode" && SQL_COMMENT.test(tile.query.source.query))
			errors.push(`tile "${tile.name}" contains a SQL comment, which spec SQL may not`)
		if (tile.query.kind === "DataVisualizationNode")
			for (const { word, at } of sqlReferences(tile.query.source.query).unparsed)
				errors.push(`tile "${tile.name}" reads ${word} in SQL the check cannot parse: "${at}"`)
		errors.push(...undeclaredReads(tile, declaredBy, isExempt))
	}
	for (const name of duplicates(alerts.map((a) => a.name)))
		errors.push(`alert name "${name}" is used twice`)
	for (const alert of alerts) {
		const tile = tiles.find((t) => t.name === alert.tile)
		if (tile?.query.kind !== "InsightVizNode" || tile.query.source.kind !== "TrendsQuery")
			errors.push(`alert "${alert.name}" must watch a trend tile, and "${alert.tile}" is not one`)
	}
	return errors
}
