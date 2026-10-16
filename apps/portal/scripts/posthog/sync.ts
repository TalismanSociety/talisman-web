import { type Api, HttpError, type Log, StepFailure } from "./api"
import {
	ALERTS,
	type Alert,
	type Dashboard,
	dashboardName,
	dashboardTitleOf,
	insightName,
	type Tile,
	tileNameOf,
	tileQuery,
} from "./dashboards"
import {
	changedFields,
	computeLayouts,
	isManaged,
	isSame,
	jsonDiff,
	MANAGED_TAG,
	pickByName,
	withoutSchemaVersion,
	withTags,
} from "./reconcile"

type StoredDashboard = {
	readonly id: number
	readonly name: string
	readonly description?: string
	readonly tags?: readonly string[]
	readonly deleted?: boolean
}

export type StoredInsight = {
	readonly id: number
	readonly name: string
	readonly description?: string
	readonly tags?: readonly string[]
	readonly deleted?: boolean
	readonly query?: unknown
	readonly dashboards?: readonly number[]
	readonly dashboard_tiles?: readonly { dashboard_id: number; deleted?: boolean }[]
}

export type SyncContext = {
	readonly api: Api
	readonly log: Log
	readonly dashboards: readonly Dashboard[]
	readonly filterTestAccounts: boolean
	readonly verbose: boolean
}

export type State = {
	readonly dashboards: StoredDashboard[]
	readonly insights: StoredInsight[]
	readonly resolved: Map<string, StoredDashboard>
	readonly claimedInsightIds: Set<number>
	readonly insightIdByTile: Map<string, number>
}

const DASHBOARDS_PATH = "/dashboards/?limit=100"
const INSIGHTS_PATH = "/insights/?limit=100&saved=true&basic=true&include_dashboards=true"

export const loadState = async ({ api, log }: SyncContext): Promise<State> => {
	const [dashboards, insights] = await Promise.all([
		api.listAll<StoredDashboard>(DASHBOARDS_PATH),
		api.listAll<StoredInsight>(INSIGHTS_PATH),
	])
	log(
		`Found ${dashboards.length} dashboards and ${insights.length} saved insights; ` +
			`${dashboards.filter(isManaged).length} and ${insights.filter(isManaged).length} managed.`
	)
	return {
		dashboards: dashboards.filter((d) => isManaged(d) && !d.deleted),
		insights: insights.filter((i) => isManaged(i) && !i.deleted && i.name),
		resolved: new Map(),
		claimedInsightIds: new Set(),
		insightIdByTile: new Map(),
	}
}

const findDashboard = (ctx: SyncContext, state: State, spec: Dashboard) =>
	pickByName(
		state.dashboards.filter((d) => dashboardTitleOf(d.name) === spec.title),
		dashboardName(ctx.dashboards, spec)
	)

const findInsight = (ctx: SyncContext, state: State, spec: Dashboard, tile: Tile) =>
	pickByName(
		state.insights.filter((i) => tileNameOf(i.name) === tile.name),
		insightName(ctx.dashboards, spec, tile)
	)

const attachedDashboardIds = (insight: StoredInsight) =>
	new Set([
		...(insight.dashboards ?? []),
		...(insight.dashboard_tiles ?? []).filter((t) => !t.deleted).map((t) => t.dashboard_id),
	])

const ensureTagged = (
	created: { readonly id: number; readonly tags?: readonly string[] },
	what: string
) => {
	if (!isManaged(created))
		throw new StepFailure(
			`PostHog created ${what} as #${created.id} without the ${MANAGED_TAG} tag, so no run could find it again. Check that the organization has tagging, then delete #${created.id} by hand`
		)
}

const ensureDashboard = async (ctx: SyncContext, state: State, spec: Dashboard) => {
	const { api, log } = ctx
	const name = dashboardName(ctx.dashboards, spec)
	const dashboard = findDashboard(ctx, state, spec)
	if (!dashboard) {
		log("  create dashboard")
		const created = await api.post<StoredDashboard>("/dashboards/", {
			name,
			description: spec.description,
			tags: [MANAGED_TAG],
			pinned: true,
		})
		ensureTagged(created, `dashboard "${name}"`)
		state.dashboards.push(created)
		return { dashboard: created, created: true }
	}
	const changed = changedFields(
		{ name: dashboard.name, description: dashboard.description ?? "", tags: dashboard.tags ?? [] },
		{ name, description: spec.description, tags: withTags(dashboard.tags) }
	)
	if (Object.keys(changed).length) {
		log(`  update dashboard #${dashboard.id}: ${Object.keys(changed).join(", ")}`)
		await api.patch(`/dashboards/${dashboard.id}/`, changed)
	} else log(`  dashboard #${dashboard.id} up to date`)
	return { dashboard, created: false }
}

const ensureInsight = async (
	ctx: SyncContext,
	state: State,
	spec: Dashboard,
	tile: Tile,
	dashboardId: number
) => {
	const { api, log } = ctx
	const name = insightName(ctx.dashboards, spec, tile)
	const query = tileQuery(tile, ctx.filterTestAccounts)
	const existing = findInsight(ctx, state, spec, tile)
	if (!existing) {
		log(`  create insight "${name}"`)
		const created = await api.post<StoredInsight>("/insights/?include_dashboards=true", {
			name,
			description: tile.description,
			tags: [MANAGED_TAG],
			query,
			saved: true,
			dashboards: [dashboardId],
		})
		ensureTagged(created, `insight "${name}"`)
		state.insights.push(created)
		return created.id
	}
	const changed: Record<string, unknown> = changedFields(
		{ name: existing.name, description: existing.description ?? "", tags: existing.tags ?? [] },
		{ name, description: tile.description, tags: withTags(existing.tags) }
	)
	const storedQuery = withoutSchemaVersion(existing.query)
	if (!isSame(storedQuery, query)) changed["query"] = query
	const attached = attachedDashboardIds(existing)
	const stray = state.dashboards
		.filter((d) => d.id !== dashboardId && attached.has(d.id))
		.map((d) => d.id)
	if (!attached.has(dashboardId) || stray.length)
		changed["dashboards"] = [
			...new Set([...[...attached].filter((id) => !stray.includes(id)), dashboardId]),
		]
	if (!Object.keys(changed).length) {
		log(`  insight #${existing.id} "${name}" up to date`)
		return existing.id
	}
	log(`  update insight #${existing.id} "${name}": ${Object.keys(changed).join(", ")}`)
	if (changed["query"] && (api.dryRun || ctx.verbose))
		for (const line of jsonDiff(storedQuery, query)) log(`    query.${line}`)
	await api.patch(`/insights/${existing.id}/?include_dashboards=true`, changed)
	return existing.id
}

type DashboardDetail = {
	readonly tiles?: readonly {
		readonly id: number
		readonly deleted?: boolean
		readonly insight?: { readonly id: number } | null
		readonly layouts?: { readonly sm?: unknown } | null
	}[]
}

const applyLayouts = async (
	{ api, log }: SyncContext,
	dashboardId: number,
	spec: Dashboard,
	insightIds: readonly number[]
) => {
	try {
		const layouts = computeLayouts(spec.tiles)
		const detail = await api.get<DashboardDetail>(`/dashboards/${dashboardId}/`)
		const tileByInsight = new Map(
			(detail.tiles ?? []).flatMap((t) => (t.insight && !t.deleted ? [[t.insight.id, t]] : []))
		)
		const tiles = insightIds.flatMap((insightId, index) => {
			const tile = tileByInsight.get(insightId)
			const layout = layouts[index]
			return tile && layout && !isSame(tile.layouts?.sm ?? null, layout.sm)
				? [{ id: tile.id, layouts: layout }]
				: []
		})
		if (tiles.length) {
			log(`  update layouts of ${tiles.length} tiles`)
			await api.patch(`/dashboards/${dashboardId}/`, { tiles })
		} else log("  layouts up to date")
	} catch (error) {
		if (error instanceof HttpError && error.status === 403) throw error
		log(`  ! layout update skipped: ${String((error as Error).message).split("\n")[0]}`)
	}
}

export const syncDashboard = async (ctx: SyncContext, state: State, spec: Dashboard) => {
	const { dashboard, created } = await ensureDashboard(ctx, state, spec)
	const insightIds: number[] = []
	for (const tile of spec.tiles) {
		const id = await ensureInsight(ctx, state, spec, tile, dashboard.id)
		insightIds.push(id)
		state.claimedInsightIds.add(id)
		state.insightIdByTile.set(tile.name, id)
	}
	if (!(ctx.api.dryRun && created)) await applyLayouts(ctx, dashboard.id, spec, insightIds)
	state.resolved.set(spec.slug, dashboard)
}

export const pruneInsights = async (
	{ api, log, dashboards }: SyncContext,
	state: State,
	selected: readonly Dashboard[]
) => {
	const allTiles = new Set(dashboards.flatMap((d) => d.tiles.map((t) => t.name)))
	const selectedTiles = new Set(selected.flatMap((d) => d.tiles.map((t) => t.name)))
	const selectedIds = new Set(selected.map((d) => state.resolved.get(d.slug)?.id))
	const everything = selected.length === dashboards.length
	const stale = state.insights.filter((insight) => {
		if (state.claimedInsightIds.has(insight.id)) return false
		const tile = tileNameOf(insight.name)
		if (selectedTiles.has(tile)) return true
		if (allTiles.has(tile)) return false
		return everything || [...attachedDashboardIds(insight)].some((id) => selectedIds.has(id))
	})
	log(stale.length ? `  soft-deleting ${stale.length} managed insight(s)` : "  nothing to remove")
	const staleIds = new Set(stale.map((insight) => insight.id))
	const staleAlerts = stale.length
		? (await api.listAll<StoredAlert>(ALERTS_PATH)).filter((a) =>
				staleIds.has(insightIdOf(a) ?? -1)
			)
		: []
	for (const alert of staleAlerts) {
		log(`  delete alert "${alert.name}" on insight #${insightIdOf(alert)}`)
		await api.delete(`/alerts/${alert.id}/`)
	}
	for (const insight of stale) {
		log(`  delete insight #${insight.id} "${insight.name}"`)
		await api.patch(`/insights/${insight.id}/`, { deleted: true })
	}
}

type StoredAlert = {
	readonly id: string
	readonly name: string
	readonly insight: number | { readonly id: number }
	readonly subscribed_users?: readonly (number | { readonly id: number })[]
	readonly threshold?: {
		readonly configuration?: {
			readonly type?: string
			readonly bounds?: { readonly lower?: number | null; readonly upper?: number | null }
		}
	}
	readonly condition?: { readonly type?: string }
	readonly config?: {
		readonly type?: string
		readonly series_index?: number
		readonly check_ongoing_interval?: boolean
	}
	readonly calculation_interval?: string
	readonly enabled?: boolean
}

const insightIdOf = (alert: StoredAlert) =>
	typeof alert.insight === "number" ? alert.insight : alert.insight?.id

const alertBody = (alert: Alert, insightId: number) => ({
	name: alert.name,
	insight: insightId,
	threshold: {
		configuration: {
			type: alert.threshold.type,
			bounds: { lower: alert.threshold.lower ?? null, upper: alert.threshold.upper ?? null },
		},
	},
	condition: { type: alert.condition },
	config: {
		type: "TrendsAlertConfig",
		series_index: alert.seriesIndex,
		check_ongoing_interval: false,
	},
	calculation_interval: alert.interval,
	enabled: true,
})

const alertCurrent = (stored: StoredAlert) => ({
	name: stored.name,
	insight: insightIdOf(stored),
	threshold: {
		configuration: {
			type: stored.threshold?.configuration?.type,
			bounds: {
				lower: stored.threshold?.configuration?.bounds?.lower ?? null,
				upper: stored.threshold?.configuration?.bounds?.upper ?? null,
			},
		},
	},
	condition: { type: stored.condition?.type },
	config: {
		type: stored.config?.type,
		series_index: stored.config?.series_index,
		check_ongoing_interval: stored.config?.check_ongoing_interval ?? false,
	},
	calculation_interval: stored.calculation_interval,
	enabled: stored.enabled,
})

const subscriberIds = (stored?: StoredAlert) =>
	(stored?.subscribed_users ?? []).map((user) => (typeof user === "number" ? user : user.id))

const ALERTS_PATH = `/alerts/?limit=100&insight_tag=${MANAGED_TAG}`
const ME_PATH = "/api/users/@me/"

export const syncAlerts = async ({ api, log }: SyncContext, state: State, prune: boolean) => {
	const wanted = ALERTS.filter((alert) => state.insightIdByTile.has(alert.tile))
	log(`  ${wanted.length} alerts on reconciled tiles`)
	const managedIds = new Set(state.insights.map((i) => i.id))
	const existing = (await api.listAll<StoredAlert>(ALERTS_PATH)).filter((a) =>
		managedIds.has(insightIdOf(a) ?? -1)
	)
	const me = await api.get<{ id: number }>(`${api.host}${ME_PATH}`)
	for (const alert of wanted) {
		const body = alertBody(alert, state.insightIdByTile.get(alert.tile) ?? -1)
		const stored = existing.find((a) => a.name === alert.name)
		const subscribers = [...new Set([...subscriberIds(stored), me.id])]
		if (!stored) {
			log(`  create alert "${alert.name}" on "${alert.tile}"`)
			await api.post("/alerts/", { ...body, subscribed_users: subscribers })
			continue
		}
		const changed: Record<string, unknown> = changedFields(alertCurrent(stored), body)
		if (!subscriberIds(stored).includes(me.id)) changed["subscribed_users"] = subscribers
		if (Object.keys(changed).length) {
			log(`  update alert "${alert.name}": ${Object.keys(changed).join(", ")}`)
			await api.patch(`/alerts/${stored.id}/`, changed)
		} else log(`  alert "${alert.name}" up to date`)
	}
	if (!prune) return
	const names = new Set(ALERTS.map((a) => a.name))
	const reconciled = new Set(state.insightIdByTile.values())
	for (const alert of existing) {
		if (names.has(alert.name) || !reconciled.has(insightIdOf(alert) ?? -1)) continue
		log(`  delete alert "${alert.name}" (not in ALERTS)`)
		await api.delete(`/alerts/${alert.id}/`)
	}
}
