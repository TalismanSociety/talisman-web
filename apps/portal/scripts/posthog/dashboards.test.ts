import { describe, expect, it } from "vitest"
import { EVENTS } from "../../src/domains/analytics/events"
import { catalogOf } from "./catalog"
import { ALERTS, DASHBOARDS, type Dashboard, specErrors, type Tile, tileQuery } from "./dashboards"
import { ev, hogql, prop, TEST_ACCOUNT_FILTERS, trend } from "./queries"

const catalog = catalogOf(EVENTS)

const board = (tiles: readonly Tile[]): Dashboard[] => [
	{ slug: "x", title: "X", prefix: "X", description: "", tiles },
]

const sqlTile = (name: string, sql: string): Tile => ({ name, description: "", query: hogql(sql) })

describe("the spec against the analytics catalog", () => {
	it("reads only events and properties the catalog declares", () => {
		expect(specErrors(DASHBOARDS, ALERTS, catalog)).toEqual([])
	})

	it("lays out the five portal dashboards", () => {
		expect(
			DASHBOARDS.map((d) => [d.slug, d.tiles.length, d.tiles.map((t) => t.name).join(", ")])
		).toEqual([
			[
				"overview",
				7,
				"Sessions, Visitors, Pageviews, Daily visitors and sessions, Pageviews by route, Pageviews by environment, Top events",
			],
			[
				"wallets",
				4,
				"Visitors connecting a wallet, Polkadot wallets, Ethereum wallets, Ethereum connections held",
			],
			[
				"portfolio",
				5,
				"Total value, Portfolio reports, Held symbols, Networks with a balance, Value held by symbol",
			],
			[
				"transactions",
				5,
				"Extrinsics by chain, Calls by pallet, Calls by pallet and call, Contract writes by chain, Contract writes by function",
			],
			["errors", 2, "Exceptions, Exceptions per session"],
		])
	})

	it("fails on a renamed event, naming the tile that reads it", () => {
		const { "Extrinsic in block": extrinsic, ...rest } = EVENTS
		const renamed = catalogOf({ ...rest, "Extrinsic finalized": extrinsic })
		expect(specErrors(DASHBOARDS, ALERTS, renamed)).toEqual(
			expect.arrayContaining([
				'tile "Extrinsics by chain" reads event "Extrinsic in block", which the catalog does not define',
				'tile "Calls by pallet and call" reads event "Extrinsic in block", which the catalog does not define',
			])
		)
	})

	it("fails on a renamed property, naming the tile that reads it", () => {
		const portfolio = EVENTS["Report portfolio balances"]
		const { symbols: _symbols, ...properties } = portfolio.properties
		const renamed = catalogOf({
			...EVENTS,
			"Report portfolio balances": { ...portfolio, properties },
		})
		expect(specErrors(DASHBOARDS, ALERTS, renamed)).toEqual([
			'tile "Held symbols" reads property "symbols", which the catalog does not define',
		])
	})

	it("fails on a property read on an event that does not declare it", () => {
		const tiles = [
			{
				name: "wallet on extrinsics",
				description: "",
				query: trend({ series: [ev("Extrinsic in block")], breakdown: "wallet" }),
			},
			sqlTile(
				"sql",
				"SELECT properties.module FROM events WHERE event = 'Write to EVM contract' AND {filters}"
			),
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([
			'tile "wallet on extrinsics" reads property "wallet" on "Extrinsic in block", which does not declare it',
			'tile "sql" reads property "module" on "Write to EVM contract", which does not declare it',
		])
	})

	it("reads SQL event filters in any case", () => {
		const tiles = [
			sqlTile(
				"renamed",
				"SELECT count() FROM events WHERE event in ('renamed_event') AND {filters}"
			),
		]
		expect(specErrors(board(tiles), [], catalogOf({}))).toEqual([
			'tile "renamed" reads event "renamed_event", which the catalog does not define',
		])
	})

	it("checks a SQL property read with brackets like one with a dot", () => {
		const tiles = [
			sqlTile(
				"module by brackets",
				"SELECT properties['module'] FROM events WHERE event IN ('Extrinsic in block', 'Write to EVM contract') AND {filters}"
			),
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([
			'tile "module by brackets" reads property "module" on "Write to EVM contract", which does not declare it',
		])
	})

	it("fails on SQL that reads event or properties in a form it cannot parse", () => {
		const tiles = [
			sqlTile(
				"opaque",
				"SELECT JSONExtractString(properties, 'module') FROM events WHERE equals(event, 'Extrinsic in block') AND {filters}"
			),
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([
			'tile "opaque" reads event in SQL the check cannot parse: "event, \'Extrinsic in block\') AND {filter"',
			'tile "opaque" reads properties in SQL the check cannot parse: "properties, \'module\') FROM events WHERE "',
		])
	})

	it.each([
		"SELECT count() FROM events WHERE event = 'Extrinsic in block' || '_v2' AND {filters}",
		"SELECT count() FROM events WHERE event = 'Extrinsic in block''x' AND {filters}",
		"SELECT count() FROM events WHERE {filters} GROUP BY event\n== 'renamed_event'",
		"SELECT event\n!= 'renamed_event' AS x FROM events WHERE {filters}",
		"SELECT count() FROM events WHERE {filters} GROUP BY event\nLIKE 'renamed%'",
		"SELECT count() FROM events WHERE event IN ('Extrinsic in block''$pageview') AND {filters}",
	])("fails closed on SQL that only looks like a parsed event form: %s", (sql) => {
		expect(specErrors(board([sqlTile("lookalike", sql)]), [], catalog)).not.toEqual([])
	})

	it.each([
		["block", "WHERE event = 'Extrinsic in block' /* gap */ || '_v2' AND {filters}"],
		["line", "WHERE event = 'Extrinsic in block' -- the block\nAND {filters}"],
		["slash", "WHERE event = 'Extrinsic in block' // gap\n|| '_v2' AND {filters}"],
		["hash", "WHERE event = 'Extrinsic in block' # gap\n|| '_v2' AND {filters}"],
	])("rejects a SQL tile with a %s comment", (name, where) => {
		const only = catalogOf({ "Extrinsic in block": EVENTS["Extrinsic in block"] })
		expect(
			specErrors(board([sqlTile(name, `SELECT count() FROM events\n${where}`)]), [], only)
		).toEqual([`tile "${name}" contains a SQL comment, which spec SQL may not`])
	})

	it("reads a bare event column at the end of the query, and not one followed by an alias", () => {
		const atEnd = sqlTile("at end", "SELECT count() FROM events WHERE {filters} GROUP BY event")
		const aliased = sqlTile("aliased", "SELECT event fromage FROM events WHERE {filters}")
		expect(specErrors(board([atEnd]), [], catalog)).toEqual([])
		expect(specErrors(board([aliased]), [], catalog)).toEqual([
			'tile "aliased" reads event in SQL the check cannot parse: "event fromage FROM events WHERE {filters"',
		])
	})

	it("fails on a tile-wide property filter that one of its events does not declare", () => {
		const both = trend({ series: [ev("Extrinsic in block"), ev("Write to EVM contract")] })
		const tiles = [
			{
				name: "staking calls",
				description: "",
				query: { ...both, source: { ...both.source, properties: [prop("module", "staking")] } },
			},
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([
			'tile "staking calls" reads property "module" on "Write to EVM contract", which does not declare it',
		])
	})

	it("fails on a misspelled PostHog property and accepts the ones the tiles read", () => {
		const tiles = [
			{
				name: "typo",
				description: "",
				query: trend({ series: [ev("$pageview")], breakdown: "$sesion_id" }),
			},
			{
				name: "sessions",
				description: "",
				query: trend({ series: [ev("$pageview")], breakdown: "$session_id" }),
			},
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([
			'tile "typo" reads property "$sesion_id", which the catalog does not define',
		])
	})

	it("accepts the environment super property on any event", () => {
		const tiles = [
			{
				name: "environment",
				description: "",
				query: trend({ series: [ev("Write to EVM contract")], breakdown: "environment" }),
			},
			sqlTile(
				"environment sql",
				"SELECT properties.environment FROM events WHERE event = 'Extrinsic in block' AND {filters}"
			),
		]
		expect(specErrors(board(tiles), [], catalog)).toEqual([])
	})

	it("fails on a duplicate tile name and a description over 400 characters", () => {
		const tile = sqlTile("twice", "SELECT count() FROM events WHERE {filters}")
		expect(
			specErrors(board([tile, { ...tile, description: "x".repeat(401) }]), [], catalog)
		).toEqual([
			'tile name "twice" is used twice',
			'tile "twice": description is 401 characters, max 400',
		])
	})
})

describe("the test-account filter", () => {
	const tiles = DASHBOARDS.flatMap((d) => d.tiles)

	it.each([true, false])(
		"applies to every tile but the environment split, with filterTestAccounts %s",
		(filterTestAccounts) => {
			const filtered = tiles.filter((tile) => {
				const { source } = tileQuery(tile, filterTestAccounts)
				const flag =
					source.kind === "HogQLQuery"
						? (source["filters"] as { filterTestAccounts?: boolean }).filterTestAccounts
						: source["filterTestAccounts"]
				return flag === true
			})
			expect(tiles.length - filtered.length).toBe(filterTestAccounts ? 1 : tiles.length)
			if (filterTestAccounts)
				expect(tiles.find((tile) => !filtered.includes(tile))?.name).toBe(
					"Pageviews by environment"
				)
		}
	)

	it("is the production hosts the client maps to the production environment", () => {
		expect(TEST_ACCOUNT_FILTERS).toEqual([
			{
				key: "$host",
				type: "event",
				operator: "exact",
				value: ["app.talisman.xyz", "talisman.pages.dev"],
			},
		])
	})
})

describe("the tiles the alerts watch", () => {
	const tiles = DASHBOARDS.flatMap((d) => d.tiles)
	const watched = tiles.filter((tile) => ALERTS.some((alert) => alert.tile === tile.name))

	it.each([true, false])(
		"count production only, whatever the project's filter, with filterTestAccounts %s",
		(filterTestAccounts) => {
			expect(watched.map((tile) => tile.name)).toEqual(["Exceptions"])
			for (const tile of watched) {
				const { source } = tileQuery(tile, filterTestAccounts)
				expect(source["filterTestAccounts"]).toBe(filterTestAccounts)
				for (const node of source["series"] as { event: string; properties?: unknown }[])
					expect(node).toMatchObject({ event: "$exception", properties: TEST_ACCOUNT_FILTERS })
			}
		}
	)
})
