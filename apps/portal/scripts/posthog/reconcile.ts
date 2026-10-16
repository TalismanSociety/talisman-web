import type { Tile } from "./dashboards"

export const MANAGED_TAG = "managed-by-code"

export const isManaged = (obj: { readonly tags?: readonly string[] | null }) =>
	(obj.tags ?? []).includes(MANAGED_TAG)

export const withTags = (
	stored: readonly string[] | null | undefined,
	required: readonly string[] = [MANAGED_TAG]
) => [...new Set([...(stored ?? []), ...required])]

const sortKeys = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(sortKeys)
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.keys(value)
				.sort()
				.map((key) => [key, sortKeys((value as Record<string, unknown>)[key])])
		)
	return value
}

const stableJson = (value: unknown) => JSON.stringify(sortKeys(value))

export const isSame = (a: unknown, b: unknown) => stableJson(a) === stableJson(b)

export const changedFields = <T extends Record<string, unknown>>(
	current: { readonly [K in keyof T]?: unknown },
	want: T
): Partial<T> =>
	Object.fromEntries(
		Object.entries(want).filter(([key, value]) => !isSame(current[key as keyof T], value))
	) as Partial<T>

export const jsonDiff = (stored: unknown, spec: unknown, limit = 12): string[] => {
	const lines: string[] = []
	const show = (value: unknown) => (value === undefined ? "(absent)" : JSON.stringify(value))
	const visit = (a: unknown, b: unknown, path: string) => {
		if (lines.length >= limit) return
		const bothObjects =
			a &&
			b &&
			typeof a === "object" &&
			typeof b === "object" &&
			Array.isArray(a) === Array.isArray(b)
		if (!bothObjects) {
			if (!isSame(a, b)) lines.push(`${path || "(root)"}: ${show(a)} → ${show(b)}`)
			return
		}
		const left = a as Record<string, unknown>
		const right = b as Record<string, unknown>
		const keys = Array.isArray(a)
			? [...Array(Math.max(a.length, (b as unknown[]).length)).keys()].map(String)
			: [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()
		for (const key of keys)
			visit(
				left[key],
				right[key],
				Array.isArray(a) ? `${path}[${key}]` : path ? `${path}.${key}` : key
			)
	}
	visit(stored, spec, "")
	return lines
}

export const withoutSchemaVersion = (query: unknown) => {
	const source = (query as { source?: Record<string, unknown> } | undefined)?.source
	if (!source || !("version" in source)) return query
	const { version: _version, ...rest } = source
	return { ...(query as object), source: rest }
}

export const pickByName = <T extends { name: string }>(
	candidates: readonly T[],
	name: string
): T | undefined => candidates.find((c) => c.name === name) ?? candidates[0]

const COLUMNS = { quarter: 3, third: 4, half: 6, full: 12 } as const
const GRID_WIDTH = 12
const HEIGHT = { number: 3, chart: 5, table: 6 }

const heightOf = (tile: Tile) => {
	const { kind } = tile.query.source
	const display = (tile.query.source["trendsFilter"] as { display?: string } | undefined)?.display
	if (display === "BoldNumber") return HEIGHT.number
	if (kind === "HogQLQuery") return HEIGHT.table
	return HEIGHT.chart
}

export type Layout = {
	readonly sm: { x: number; y: number; w: number; h: number }
	readonly xs: { x: number; y: number; w: number; h: number }
}

export const computeLayouts = (tiles: readonly Tile[]): Layout[] => {
	const rows: { tile: Tile; x: number; w: number }[][] = []
	let x = GRID_WIDTH
	for (const tile of tiles) {
		const w = COLUMNS[tile.size ?? "half"]
		if (x + w > GRID_WIDTH) {
			rows.push([])
			x = 0
		}
		rows.at(-1)?.push({ tile, x, w })
		x += w
	}
	let y = 0
	let xsY = 0
	return rows.flatMap((row) => {
		const h = Math.max(...row.map(({ tile }) => heightOf(tile)))
		const layouts = row.map(({ x, w }) => {
			const layout = { sm: { x, y, w, h }, xs: { x: 0, y: xsY, w: 1, h } }
			xsY += h
			return layout
		})
		y += h
		return layouts
	})
}
