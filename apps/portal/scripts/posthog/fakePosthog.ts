import { type Api, HttpError } from "./api"

type Json = Record<string, unknown>

type FakeTile = { id: number; insight: number; layouts: Json; deleted: boolean }
type FakeDashboard = Json & { id: number; tags: string[]; tiles: FakeTile[] }
type FakeInsight = Json & { id: number; query?: Json; dashboards: number[] }

export type FakeProject = {
	project: Json
	dashboards: FakeDashboard[]
	insights: FakeInsight[]
	alerts: Json[]
	eventDefinitions: Json[]
	propertyDefinitions: Json[]
	transformations: Json[]
	me: { id: number }
	nextId: number
	denied: readonly string[]
	untaggedCreates: readonly string[]
}

export type Write = { readonly method: string; readonly path: string; readonly body?: unknown }

const clone = <T>(value: T): T => structuredClone(value)

const pathname = (path: string) => path.split("?")[0] ?? path

const idIn = (path: string, collection: string) => {
	const match = new RegExp(`^/${collection}/([^/]+)/$`).exec(pathname(path))
	return match?.[1]
}

export const emptyProject = (overrides: Partial<FakeProject> = {}): FakeProject => ({
	project: {},
	dashboards: [],
	insights: [],
	alerts: [],
	eventDefinitions: [],
	propertyDefinitions: [],
	transformations: [],
	me: { id: 7 },
	nextId: 1,
	denied: [],
	untaggedCreates: [],
	...overrides,
})

export class FakePosthog implements Api {
	readonly host = "https://posthog.test"
	readonly writes: Write[] = []
	#nextDryRunId = 900_000

	constructor(
		readonly store: FakeProject,
		readonly dryRun = false
	) {}

	#guard(path: string, method = "GET") {
		const denies = (entry: string) => {
			const [deniedMethod, prefix] = entry.includes(" ") ? entry.split(" ") : [method, entry]
			return deniedMethod === method && pathname(path).startsWith(prefix ?? entry)
		}
		if (this.store.denied.some(denies))
			throw new HttpError(
				`403 ${path}`,
				403,
				`API key missing required scope for ${pathname(path)}`
			)
	}

	#newId() {
		return this.store.nextId++
	}

	#dashboard(id: number) {
		const dashboard = this.store.dashboards.find((d) => d.id === id)
		if (!dashboard) throw new HttpError(`404 dashboard ${id}`, 404, "Not found")
		return dashboard
	}

	#attach(insight: FakeInsight, dashboardIds: readonly number[]) {
		for (const dashboard of this.store.dashboards) {
			const tile = dashboard.tiles.find((t) => t.insight === insight.id && !t.deleted)
			if (dashboardIds.includes(dashboard.id) && !tile)
				dashboard.tiles.push({
					id: this.#newId(),
					insight: insight.id,
					layouts: {},
					deleted: false,
				})
			if (!dashboardIds.includes(dashboard.id) && tile) tile.deleted = true
		}
		insight.dashboards = [...dashboardIds]
	}

	#stampVersion(insight: FakeInsight) {
		const source = insight.query?.["source"] as Json | undefined
		if (source) source["version"] = 2
	}

	async get<T>(path: string): Promise<T> {
		this.#guard(path)
		if (path === `${this.host}/api/users/@me/`) return clone(this.store.me) as T
		if (path === "/") return clone(this.store.project) as T
		const dashboardId = idIn(path, "dashboards")
		if (dashboardId) {
			const { tiles, ...dashboard } = this.#dashboard(Number(dashboardId))
			return clone({
				...dashboard,
				tiles: tiles.map((t) => ({ ...t, insight: { id: t.insight } })),
			}) as T
		}
		const functionId = idIn(path, "hog_functions")
		if (functionId)
			return clone(this.store.transformations.find((f) => f["id"] === functionId)) as T
		throw new Error(`fake GET ${path} not modelled`)
	}

	async listAll<T>(path: string): Promise<T[]> {
		this.#guard(path)
		const lists: Record<string, () => unknown[]> = {
			"/dashboards/": () => this.store.dashboards.map(({ tiles: _tiles, ...d }) => d),
			"/insights/": () => this.store.insights,
			"/alerts/": () => this.store.alerts,
			"/event_definitions/": () => this.store.eventDefinitions,
			"/property_definitions/": () => this.store.propertyDefinitions,
			"/hog_functions/": () => this.store.transformations.map(({ inputs: _inputs, ...f }) => f),
		}
		const list = lists[pathname(path)]
		if (!list) throw new Error(`fake list ${path} not modelled`)
		return clone(list()) as T[]
	}

	async query<T>(): Promise<T> {
		return { results: [] } as T
	}

	#record<T>(method: string, path: string, body: unknown, apply: () => unknown): Promise<T> {
		this.#guard(path, method)
		this.writes.push({ method, path, body: clone(body) })
		if (this.dryRun) return Promise.resolve({ id: this.#nextDryRunId++, ...(body as object) } as T)
		return Promise.resolve(clone(apply()) as T)
	}

	post<T>(path: string, body: unknown): Promise<T> {
		const fields = clone(body) as Json
		if (this.store.untaggedCreates.includes(pathname(path))) fields["tags"] = []
		return this.#record("POST", path, body, () => {
			switch (pathname(path)) {
				case "/dashboards/": {
					const dashboard: FakeDashboard = { tags: [], ...fields, id: this.#newId(), tiles: [] }
					this.store.dashboards.push(dashboard)
					return dashboard
				}
				case "/insights/": {
					const { dashboards = [], ...rest } = fields as Json & { dashboards?: number[] }
					const insight: FakeInsight = { ...rest, id: this.#newId(), dashboards: [] }
					this.#stampVersion(insight)
					this.store.insights.push(insight)
					this.#attach(insight, dashboards)
					return insight
				}
				case "/alerts/": {
					const alert = { ...fields, id: `alert-${this.#newId()}` }
					this.store.alerts.push(alert)
					return alert
				}
				default:
					throw new Error(`fake POST ${path} not modelled`)
			}
		})
	}

	patch<T>(path: string, body: unknown): Promise<T> {
		const fields = clone(body) as Json
		return this.#record("PATCH", path, body, () => {
			if (path === "/") return Object.assign(this.store.project, fields)
			const dashboardId = idIn(path, "dashboards")
			if (dashboardId) {
				const dashboard = this.#dashboard(Number(dashboardId))
				const { tiles, ...rest } = fields as { tiles?: { id: number; layouts: Json }[] }
				Object.assign(dashboard, rest)
				for (const { id, layouts } of tiles ?? []) {
					const tile = dashboard.tiles.find((t) => t.id === id)
					if (tile) tile.layouts = layouts
				}
				return dashboard
			}
			const insightId = idIn(path, "insights")
			if (insightId) {
				const insight = this.store.insights.find((i) => i.id === Number(insightId))
				if (!insight) throw new HttpError(`404 insight ${insightId}`, 404, "Not found")
				const { dashboards, ...rest } = fields as Json & { dashboards?: number[] }
				Object.assign(insight, rest)
				if (rest["query"]) this.#stampVersion(insight)
				if (dashboards) this.#attach(insight, dashboards)
				return insight
			}
			const alertId = idIn(path, "alerts")
			const definitionPath = /^\/(event|property)_definitions\/([^/]+)\/$/.exec(pathname(path))
			const target = alertId
				? this.store.alerts.find((a) => a["id"] === alertId)
				: definitionPath
					? (definitionPath[1] === "event"
							? this.store.eventDefinitions
							: this.store.propertyDefinitions
						).find((d) => d["id"] === definitionPath[2])
					: undefined
			if (!target) throw new Error(`fake PATCH ${path} not modelled`)
			return Object.assign(target, fields)
		})
	}

	delete(path: string): Promise<null> {
		return this.#record("DELETE", path, undefined, () => {
			const alertId = idIn(path, "alerts")
			this.store.alerts = this.store.alerts.filter((a) => a["id"] !== alertId)
			return null
		})
	}
}
