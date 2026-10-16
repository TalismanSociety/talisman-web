import { describe, expect, it, vi } from "vitest"
import { EVENTS } from "../../src/domains/analytics/events"
import { catalogOf } from "./catalog"
import { DASHBOARDS } from "./dashboards"
import { emptyProject, FakePosthog, type FakeProject } from "./fakePosthog"
import { runProvisioning } from "./run"
import { PROPERTY_FILTER_TEMPLATE } from "./settings"

const catalog = catalogOf(EVENTS)
const dashboards = DASHBOARDS

const LEGACY_TEST_ACCOUNT_FILTERS = [
	{ key: "email", type: "person", value: "@talisman.xyz", operator: "not_icontains" },
	{ key: "$host", type: "event", value: "localhost", operator: "not_icontains" },
]

const liveLikeProject = (): FakeProject =>
	emptyProject({
		project: {
			anonymize_ips: true,
			autocapture_opt_out: null,
			heatmaps_opt_in: null,
			capture_dead_clicks: false,
			session_recording_opt_in: false,
			test_account_filters: LEGACY_TEST_ACCOUNT_FILTERS,
			test_account_filters_default_checked: true,
			primary_dashboard: 78310,
		},
		dashboards: [
			{ id: 78310, name: "Portal Usage", tags: [], tiles: [] },
			{ id: 76884, name: "Portal Health", tags: [], tiles: [] },
			{ id: 76885, name: "01. Overview", description: "made by hand", tags: [], tiles: [] },
		],
		insights: [
			{ id: 501, name: "Pageviews", tags: [], query: { kind: "InsightVizNode" }, dashboards: [] },
			{
				id: 502,
				name: "Sessions",
				tags: ["mine"],
				query: { kind: "InsightVizNode" },
				dashboards: [],
			},
		],
		eventDefinitions: [
			{ id: "e1", name: "$pageview", description: null, tags: [] },
			{ id: "e2", name: "Extrinsic in block", description: "old", tags: ["hand-made"] },
		],
		propertyDefinitions: [
			{ id: "p1", name: "chain", description: null, tags: [], property_type: null },
			{ id: "p2", name: "chains", description: null, tags: [], property_type: "Numeric" },
			{ id: "p3", name: "environment", description: null, tags: [], property_type: "String" },
		],
		nextId: 10_000,
	})

const attachTilesTo = (store: FakeProject, dashboardId: number) => {
	const dashboard = store.dashboards.find((d) => d.id === dashboardId)
	if (!dashboard) throw new Error(`no dashboard ${dashboardId}`)
	for (const insight of store.insights) {
		dashboard.tiles.push({
			id: insight.id + 1000,
			insight: insight.id,
			layouts: { x: 1 },
			deleted: false,
		})
		insight.dashboards = [dashboard.id]
	}
}

type Options = Parameters<typeof runProvisioning>[0]["options"]

const run = (api: FakePosthog, lines: string[] = [], options: Partial<Options> = {}) =>
	runProvisioning({
		api,
		log: (line) => lines.push(line),
		events: EVENTS,
		catalog,
		dashboards,
		selected: dashboards,
		options: {
			seed: false,
			checkQueries: false,
			prune: true,
			skipDefinitions: false,
			filterTestAccounts: true,
			verbose: false,
			ingest: () => Promise.reject(new Error("no seed in this test")),
			...options,
		},
	})

const MANAGED = "managed-by-code"

const tagsOf = (object: Readonly<Record<string, unknown>>) => (object["tags"] ?? []) as string[]

const managed = <T extends Readonly<Record<string, unknown>>>(objects: readonly T[]) =>
	objects.filter((object) => tagsOf(object).includes(MANAGED))

const untagged = (store: FakeProject) =>
	JSON.stringify({
		dashboards: store.dashboards.filter((d) => !tagsOf(d).includes(MANAGED)),
		insights: store.insights.filter((i) => !tagsOf(i).includes(MANAGED)),
	})

describe("provisioning against a recording fake", () => {
	it("creates the spec, then plans zero writes against its own output", async () => {
		const store = liveLikeProject()
		expect((await run(new FakePosthog(store))).failedSteps).toEqual([])
		expect(managed(store.dashboards).map((d) => d["name"])).toEqual([
			"01. Overview",
			"02. Wallets",
			"03. Portfolio",
			"04. Transactions",
			"05. Errors",
		])
		expect(managed(store.insights)).toHaveLength(dashboards.flatMap((d) => d.tiles).length)
		expect(store.alerts.map((a) => a["name"])).toEqual([
			"Exceptions doubled",
			"More than 50 exceptions a day",
		])

		const second = new FakePosthog(store, true)
		expect((await run(second)).failedSteps).toEqual([])
		expect(second.writes).toEqual([])
	})

	it("writes nothing in a dry run, and never ingests a seed", async () => {
		const store = liveLikeProject()
		const before = structuredClone(store)
		const ingest = vi.fn(() => Promise.resolve())
		const lines: string[] = []
		const api = new FakePosthog(store, true)

		const result = await run(api, lines, { seed: true, ingest })

		expect(result.failedSteps).toEqual([])
		expect(store).toEqual(before)
		expect(ingest).not.toHaveBeenCalled()
		expect(lines.some((line) => line.includes("[dry-run] would send"))).toBe(true)
		expect(api.writes.length).toBeGreaterThan(0)
	})

	it("leaves untagged dashboards, insights and the primary dashboard alone", async () => {
		const store = liveLikeProject()
		attachTilesTo(store, 78310)
		const before = untagged(store)
		await run(new FakePosthog(store))
		await run(new FakePosthog(store))
		expect(untagged(store)).toBe(before)
		const overview = managed(store.dashboards).find((d) => d["name"] === "01. Overview")
		expect(overview?.id).not.toBe(76885)
		expect(store.project["primary_dashboard"]).toBe(78310)
	})

	it("tightens the privacy settings and narrows the test-account filter to production hosts", async () => {
		const store = liveLikeProject()
		await run(new FakePosthog(store))
		expect(store.project).toMatchObject({
			anonymize_ips: true,
			autocapture_opt_out: true,
			heatmaps_opt_in: false,
			session_recording_opt_in: false,
			test_account_filters: [
				{
					key: "$host",
					type: "event",
					operator: "exact",
					value: ["app.talisman.xyz", "talisman.pages.dev"],
				},
			],
			test_account_filters_default_checked: true,
		})
	})

	it("stops only the steps the missing scopes deny, and reports PostHog's message", async () => {
		const store = liveLikeProject()
		store.denied = ["/hog_functions/", "/event_definitions/", "/alerts/"]
		const lines: string[] = []
		const result = await run(new FakePosthog(store), lines)
		expect(result.failedSteps).toEqual(["Transformations", "Definitions", "Alerts"])
		expect(lines).toContain("✗ Transformations: API key missing required scope for /hog_functions/")
		expect(managed(store.dashboards)).toHaveLength(dashboards.length)
	})

	it("fails each dashboard step when PostHog drops the tag of a created dashboard", async () => {
		const store = liveLikeProject()
		store.untaggedCreates = ["/dashboards/"]
		const lines: string[] = []
		const result = await run(new FakePosthog(store), lines)
		expect(result.failedSteps).toEqual(dashboards.map((d) => `Dashboard ${d.title} [${d.slug}]`))
		expect(managed(store.insights)).toEqual([])
		expect(lines.filter((line) => line.includes(`without the ${MANAGED} tag`))).toHaveLength(
			dashboards.length
		)
	})

	it("stops a dashboard at its first insight when PostHog drops the tag of a created insight", async () => {
		const store = liveLikeProject()
		store.untaggedCreates = ["/insights/"]
		const result = await run(new FakePosthog(store))
		expect(result.failedSteps).toEqual(dashboards.map((d) => `Dashboard ${d.title} [${d.slug}]`))
		expect(store.insights.filter((i) => i.id >= 10_000)).toHaveLength(dashboards.length)
	})

	it("keeps a hand-made definition tag and retypes a list property stored as a number", async () => {
		const store = liveLikeProject()
		await run(new FakePosthog(store))
		expect(store.eventDefinitions.find((d) => d["name"] === "Extrinsic in block")).toMatchObject({
			description:
				"A Substrate transaction the portal built reached a block without a dispatch error, once for the call and once for each call of a batch",
			verified: true,
			tags: ["hand-made", MANAGED],
		})
		expect(store.propertyDefinitions.find((d) => d["name"] === "chains")).toMatchObject({
			property_type: "String",
			tags: [MANAGED],
		})
		expect(store.propertyDefinitions.find((d) => d["name"] === "environment")?.["tags"]).toEqual([
			MANAGED,
			"super",
		])
	})

	it("fails the transformations step when GeoIP keeps a precise field", async () => {
		const store = liveLikeProject()
		store.transformations = [
			{
				id: "geoip",
				name: "GeoIP",
				enabled: true,
				execution_order: 1,
				template_id: "template-geoip",
			},
			{
				id: "filter",
				name: "Drop city",
				enabled: true,
				execution_order: 2,
				template: { id: PROPERTY_FILTER_TEMPLATE },
				inputs: { propertiesToFilter: { value: "$geoip_latitude" } },
			},
		]
		const lines: string[] = []
		const result = await run(new FakePosthog(store), lines)
		expect(result.failedSteps).toEqual(["Transformations"])
		expect(lines.find((line) => line.startsWith("✗ Transformations"))).toMatch(
			/^✗ Transformations: "Drop city" keeps \$geoip_city_name,/
		)
	})

	it.each([
		["01. Overview", "Dashboard Overview [overview]"],
		["05. Errors", "Dashboard Errors [errors]"],
	])("prunes no insight and no alert when the %s step fails", async (title, step) => {
		const store = liveLikeProject()
		await run(new FakePosthog(store))
		const board = managed(store.dashboards).find((d) => d["name"] === title)
		if (!board) throw new Error(`no ${title}`)
		board["description"] = "edited by hand"
		store.denied = [`/dashboards/${board.id}/`]
		const alerts = store.alerts.map((a) => a["name"])
		const lines: string[] = []

		const result = await run(new FakePosthog(store), lines)

		expect(result.failedSteps).toEqual([step])
		expect(store.insights.filter((i) => i["deleted"])).toEqual([])
		expect(store.alerts.map((a) => a["name"])).toEqual(alerts)
		expect(lines).toContain("\n✗ Prune skipped: a dashboard step failed")
	})

	it("fails the dashboard step when PostHog refuses the layout", async () => {
		const store = liveLikeProject()
		await run(new FakePosthog(store))
		const overview = managed(store.dashboards).find((d) => d["name"] === "01. Overview")
		const first = overview?.tiles[0]
		if (!overview || !first) throw new Error("no Overview tile")
		first.layouts = { sm: { x: 6, y: 99, w: 1, h: 1 } }
		store.denied = [`PATCH /dashboards/${overview.id}/`]
		const lines: string[] = []

		const result = await run(new FakePosthog(store), lines)

		expect(lines).toContain("  update layouts of 1 tiles")
		expect(result.failedSteps).toEqual(["Dashboard Overview [overview]"])
	})

	it("restores the query of a managed insight edited in PostHog", async () => {
		const store = liveLikeProject()
		await run(new FakePosthog(store))
		const insight = managed(store.insights).find(
			(i) => i["name"] === "04. Transactions · Calls by pallet"
		)
		if (!insight) throw new Error("no Calls by pallet")
		const spec = structuredClone(insight["query"])
		insight["query"] = { kind: "InsightVizNode", source: { kind: "TrendsQuery", series: [] } }
		const lines: string[] = []

		await run(new FakePosthog(store), lines)

		expect(insight["query"]).toEqual(spec)
		expect(lines).toContain(
			`  update insight #${insight.id} "04. Transactions · Calls by pallet": query`
		)
	})

	it("prunes a stale managed insight together with its alert", async () => {
		const store = liveLikeProject()
		store.insights.push({
			id: 777,
			name: "04. Transactions · Retired tile",
			tags: [MANAGED],
			query: { kind: "InsightVizNode" },
			dashboards: [],
		})
		store.alerts.push({ id: "alert-retired", name: "Retired alert", insight: 777 })

		expect((await run(new FakePosthog(store))).failedSteps).toEqual([])

		expect(store.insights.find((i) => i.id === 777)?.["deleted"]).toBe(true)
		expect(store.alerts.map((a) => a["name"])).toEqual([
			"Exceptions doubled",
			"More than 50 exceptions a day",
		])
	})
})
