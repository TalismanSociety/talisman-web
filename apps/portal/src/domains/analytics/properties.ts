type Described = { readonly description: string; readonly optional?: true }

export type PropertyDef = Described &
	(
		| { readonly posthogType: "String"; readonly values: readonly string[]; readonly list?: true }
		| { readonly posthogType: "Boolean" }
		| { readonly posthogType: "Numeric" }
	)

export type PropertyDefs = Readonly<Record<string, PropertyDef>>

type ValueOf<D> = D extends { readonly values: readonly (infer V)[] }
	? D extends { readonly list: true }
		? readonly V[]
		: V
	: D extends { readonly posthogType: "Boolean" }
		? boolean
		: number

type OptionalKeys<Defs> = {
	[K in keyof Defs]: Defs[K] extends { readonly optional: true } ? K : never
}[keyof Defs]

export type PropertyValues<Defs extends PropertyDefs> = {
	[K in Exclude<keyof Defs, OptionalKeys<Defs>>]: ValueOf<Defs[K]>
} & { [K in OptionalKeys<Defs>]?: ValueOf<Defs[K]> }

export const p = {
	enum: <const V extends string>(values: readonly V[], description: string) =>
		({ posthogType: "String", description, values }) as const,
	enumList: <const V extends string>(values: readonly V[], description: string) =>
		({ posthogType: "String", description, values, list: true }) as const,
	bool: (description: string) => ({ posthogType: "Boolean", description }) as const,
	count: (description: string) => ({ posthogType: "Numeric", description }) as const,
} satisfies Record<string, (...args: never[]) => PropertyDef>

export const optional = <const D extends PropertyDef>(def: D) =>
	({ ...def, optional: true }) as const

const isEnumValue = (values: readonly string[], value: unknown) =>
	typeof value === "string" && values.includes(value)

const isEnumList = (values: readonly string[], value: unknown) =>
	Array.isArray(value) &&
	value.every((item) => isEnumValue(values, item)) &&
	new Set(value).size === value.length

export const isPropertyValue = (property: PropertyDef, value: unknown) => {
	switch (property.posthogType) {
		case "String":
			return property.list
				? isEnumList(property.values, value)
				: isEnumValue(property.values, value)
		case "Boolean":
			return typeof value === "boolean"
		case "Numeric":
			return typeof value === "number" && Number.isFinite(value)
	}
}

export const parseEnum =
	<const V extends string, const F extends V>(values: readonly V[], fallback: F) =>
	(value: string | undefined): V =>
		values.find((known) => known === value) ?? fallback

export const USD_BUCKETS = ["<10", "10-100", "100-1k", "1k-10k", "10k-100k", "100k+"] as const

export type UsdBucket = (typeof USD_BUCKETS)[number]

const USD_BUCKET_FLOORS: readonly [number, UsdBucket][] = [
	[100_000, "100k+"],
	[10_000, "10k-100k"],
	[1_000, "1k-10k"],
	[100, "100-1k"],
	[10, "10-100"],
]

export const usdBucketOf = (usd: number): UsdBucket =>
	USD_BUCKET_FLOORS.find(([floor]) => usd >= floor)?.[1] ?? "<10"
