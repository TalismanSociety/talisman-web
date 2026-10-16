import { randomUUID } from "node:crypto"
import type { EventDef } from "../../src/domains/analytics/events"
import { type Api, HttpError, type Log, StepFailure } from "./api"
import type { CatalogSnapshot } from "./catalog"
import { type Dashboard, filtersTestAccounts, type Tile, tileQuery } from "./dashboards"
import {
	type DefinitionSpec,
	definitionChanges,
	eventDefinitionSpecs,
	eventsToSeed,
	propertyDefinitionSpecs,
	type SeedEvent,
	type StoredDefinition,
	seedBatch,
} from "./definitions"
import { TEST_ACCOUNT_FILTERS, withInlineTestAccountFilter } from "./queries"
import { isSame } from "./reconcile"
import {
	findGeoip,
	PRIVATE_SETTINGS,
	type ProjectSettings,
	projectSettingsPatch,
	propertyFilterIds,
	type Transformation,
	transformationProblems,
} from "./settings"
import {
	loadState,
	pruneInsights,
	type State,
	type SyncContext,
	syncAlerts,
	syncDashboard,
} from "./sync"

type RunOptions = {
	readonly seed: boolean
	readonly checkQueries: boolean
	readonly prune: boolean
	readonly skipDefinitions: boolean
	readonly filterTestAccounts: boolean
	readonly verbose: boolean
	readonly ingest: (batch: readonly SeedEvent[]) => Promise<void>
}

export type RunInput = {
	readonly api: Api
	readonly log: Log
	readonly events: Readonly<Record<string, EventDef>>
	readonly catalog: CatalogSnapshot
	readonly dashboards: readonly Dashboard[]
	readonly selected: readonly Dashboard[]
	readonly options: RunOptions
}

export type RunResult = {
	readonly failedSteps: readonly string[]
	readonly failedQueries: readonly string[]
	readonly resolved: ReadonlyMap<string, { readonly id: number }>
}

const SEED_POLL_INTERVAL_MS = 15_000
const SEED_POLL_TIMEOUT_MS = 10 * 60_000
const SEED_BATCH_SIZE = 50
const EVENT_DEFINITIONS_PATH = "/event_definitions/?limit=100"
const PROPERTY_DEFINITIONS_PATH = "/property_definitions/?type=event&limit=100"
const TRANSFORMATIONS_PATH = "/hog_functions/?type=transformation&limit=100"

const syncProjectSettings = async ({ api, log }: SyncContext) => {
	const current = await api.get<ProjectSettings>("/")
	const patch: Record<string, unknown> = projectSettingsPatch(current)
	const keys = [
		...Object.keys(PRIVATE_SETTINGS),
		"test_account_filters",
		"test_account_filters_default_checked",
	]
	for (const key of keys) {
		const now = JSON.stringify(current[key] ?? null)
		log(key in patch ? `  ${key}: ${now} → ${JSON.stringify(patch[key])}` : `  ${key}: ${now}`)
	}
	if (Object.keys(patch).length) await api.patch("/", patch)
	else log("  project settings up to date")
}

const checkTransformations = async ({ api, log }: SyncContext) => {
	const transformations = await api.listAll<Transformation>(TRANSFORMATIONS_PATH)
	const geoip = findGeoip(transformations)
	const filters = await Promise.all(
		propertyFilterIds(transformations).map((id) => api.get<Transformation>(`/hog_functions/${id}/`))
	)
	const problems = transformationProblems(geoip, filters)
	if (problems.length) throw new StepFailure(problems.join("; "))
	log(
		geoip?.enabled
			? `  GeoIP (order ${geoip.execution_order}) runs before a property filter that drops every precise field`
			: "  GeoIP is off, so no location is derived"
	)
}

const storedNames = async (api: Api) => {
	const [events, properties] = await Promise.all([
		api.listAll<StoredDefinition>(EVENT_DEFINITIONS_PATH),
		api.listAll<StoredDefinition>(PROPERTY_DEFINITIONS_PATH),
	])
	return {
		events: new Set(events.map((d) => d.name)),
		properties: new Set(properties.map((d) => d.name)),
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const seed = async ({ api, log, events, catalog, options }: RunInput) => {
	const stored = await storedNames(api)
	const missing = eventsToSeed(catalog, stored.events, stored.properties)
	if (!missing.length) {
		log("  every seedable event and property has a definition")
		return
	}
	const batch = seedBatch(
		events,
		missing.map((e) => e.name),
		{ distinctId: randomUUID(), newUuid: randomUUID, now: new Date() }
	)
	log(`  ${api.dryRun ? "[dry-run] would send" : "sending"} ${batch.length} events:`)
	for (const event of batch) log(`    ${event.event} ${JSON.stringify(event.properties)}`)
	if (api.dryRun) return
	for (let i = 0; i < batch.length; i += SEED_BATCH_SIZE)
		await options.ingest(batch.slice(i, i + SEED_BATCH_SIZE))

	const wantEvents = missing.map((e) => e.name)
	const wantProperties = [
		...new Set([
			...missing.flatMap((e) => e.properties),
			...catalog.properties.filter((p) => p.isSuper).map((p) => p.name),
		]),
	]
	const deadline = Date.now() + SEED_POLL_TIMEOUT_MS
	for (;;) {
		await sleep(SEED_POLL_INTERVAL_MS)
		const now = await storedNames(api)
		const still = [
			...wantEvents.filter((name) => !now.events.has(name)),
			...wantProperties.filter((name) => !now.properties.has(name)),
		]
		if (!still.length) {
			log("  every seeded definition exists")
			return
		}
		if (Date.now() > deadline) {
			log(`  ! still missing after the wait, synced next run: ${still.join(", ")}`)
			return
		}
		log(`  waiting for ${still.length} definitions`)
	}
}

const syncDefinitionKind = async (
	{ api, log }: SyncContext,
	label: string,
	listPath: string,
	path: string,
	specs: readonly DefinitionSpec[]
) => {
	const stored = new Map(
		(await api.listAll<StoredDefinition>(listPath)).map((d) => [d.name, d] as const)
	)
	const unseen: string[] = []
	const refused: string[] = []
	let upToDate = 0
	for (const spec of specs) {
		const definition = stored.get(spec.name)
		if (!definition) {
			unseen.push(spec.name)
			continue
		}
		const changed = definitionChanges(spec, definition)
		if (!Object.keys(changed).length) {
			upToDate++
			continue
		}
		log(`  update ${label} "${spec.name}": ${Object.keys(changed).join(", ")}`)
		try {
			await api.patch(`${path}${definition.id}/`, changed)
		} catch (error) {
			if (!(error instanceof HttpError) || error.status >= 500 || error.status === 403) throw error
			refused.push(`${spec.name} (HTTP ${error.status}: ${error.detail})`)
		}
	}
	log(`  ${upToDate} ${label} definitions up to date`)
	if (unseen.length)
		log(`  ${unseen.length} ${label}(s) not received yet, skipped: ${unseen.join(", ")}`)
	if (refused.length) throw new StepFailure(`${label}(s) refused: ${refused.join(", ")}`)
}

const syncDefinitions = async (ctx: SyncContext, catalog: CatalogSnapshot) => {
	await syncDefinitionKind(
		ctx,
		"event",
		EVENT_DEFINITIONS_PATH,
		"/event_definitions/",
		eventDefinitionSpecs(catalog)
	)
	await syncDefinitionKind(
		ctx,
		"property",
		PROPERTY_DEFINITIONS_PATH,
		"/property_definitions/",
		propertyDefinitionSpecs(catalog)
	)
}

type QueryResponse = { readonly results?: unknown }

const hasPositiveCount = (value: unknown): boolean => {
	if (Array.isArray(value)) return value.some(hasPositiveCount)
	if (!value || typeof value !== "object") return false
	const node = value as { count?: unknown; aggregated_value?: unknown; data?: unknown }
	return (
		(typeof node.count === "number" && node.count > 0) ||
		(typeof node.aggregated_value === "number" && node.aggregated_value > 0) ||
		(Array.isArray(node.data) && node.data.some((v) => typeof v === "number" && v > 0))
	)
}

const hasData = (kind: string, response: QueryResponse) =>
	Array.isArray(response.results) &&
	(kind === "HogQLQuery" ? response.results.length > 0 : hasPositiveCount(response.results))

const checkQueries = async (
	{ api, log, filterTestAccounts }: SyncContext,
	selected: readonly Dashboard[]
) => {
	const tiles: Tile[] = selected.flatMap((spec) => [...spec.tiles])
	const project = await api.get<ProjectSettings>("/")
	const inline =
		filterTestAccounts && !isSame(project["test_account_filters"], TEST_ACCOUNT_FILTERS)
	log(
		!filterTestAccounts
			? "  test-account filter off"
			: inline
				? "  the project's test-account filter is not the spec's yet, so each query carries the spec's filter"
				: "  test-account filter: the project's, which matches the spec"
	)
	const failures: string[] = []
	let withData = 0
	for (const tile of tiles) {
		const query = tileQuery(tile, filterTestAccounts)
		const { source } =
			inline && filtersTestAccounts(tile, filterTestAccounts)
				? withInlineTestAccountFilter(query)
				: query
		try {
			const response = await api.query<QueryResponse>(source)
			const data = hasData(source.kind, response)
			if (data) withData++
			log(`  ok ${tile.name}: ${data ? "data" : "empty"}`)
		} catch (error) {
			if (error instanceof HttpError && error.status === 403) throw error
			const detail = error instanceof HttpError ? error.detail : String(error)
			failures.push(tile.name)
			log(`  ✗ ${tile.name}: ${detail.replace(/\s+/g, " ").slice(0, 400)}`)
		}
	}
	log(
		`  ${tiles.length - failures.length}/${tiles.length} queries ran, ${withData} with data, ${tiles.length - failures.length - withData} empty`
	)
	return failures
}

export const runProvisioning = async (input: RunInput): Promise<RunResult> => {
	const { api, log, catalog, dashboards, selected, options } = input
	const ctx: SyncContext = {
		api,
		log,
		dashboards,
		filterTestAccounts: options.filterTestAccounts,
		verbose: options.verbose,
	}
	const failedSteps: string[] = []
	const step = async <T>(name: string, run: () => Promise<T>): Promise<T | undefined> => {
		log(`\n▶ ${name}`)
		try {
			return await run()
		} catch (error) {
			const denied = error instanceof HttpError && error.status === 403
			if (!denied && !(error instanceof StepFailure)) throw error
			log(`✗ ${name}: ${denied ? error.detail : error.message}`)
			failedSteps.push(name)
			return undefined
		}
	}

	const state: State | undefined = await step("Dashboards and insights", () => loadState(ctx))
	await step("Project settings", () => syncProjectSettings(ctx))
	await step("Transformations", () => checkTransformations(ctx))
	if (options.seed) await step("Seed", () => seed(input))
	if (!options.skipDefinitions) await step("Definitions", () => syncDefinitions(ctx, catalog))
	if (state) {
		const failedBefore = failedSteps.length
		for (const spec of selected)
			await step(`Dashboard ${spec.title} [${spec.slug}]`, () => syncDashboard(ctx, state, spec))
		const dashboardsSynced = failedSteps.length === failedBefore
		const prune = options.prune && dashboardsSynced
		if (options.prune && !dashboardsSynced) log("\n✗ Prune skipped: a dashboard step failed")
		await step("Alerts", () => syncAlerts(ctx, state, prune))
		if (prune) await step("Prune", () => pruneInsights(ctx, state, selected))
	} else log("\n✗ Dashboards, alerts and prune skipped: the dashboard and insight lists failed")
	const failedQueries = options.checkQueries
		? ((await step("Query check", () => checkQueries(ctx, selected))) ?? [])
		: []
	return { failedSteps, failedQueries, resolved: state?.resolved ?? new Map() }
}
