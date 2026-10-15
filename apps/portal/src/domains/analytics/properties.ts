type Described = { readonly description: string; readonly optional?: true }

export type PropertyDef = Described &
	(
		| { readonly posthogType: "String"; readonly values: readonly string[] }
		| { readonly posthogType: "Numeric" }
	)

export type PropertyDefs = Readonly<Record<string, PropertyDef>>

type ValueOf<D> = D extends { readonly values: readonly (infer V)[] } ? V : number

type OptionalKeys<Defs> = {
	[K in keyof Defs]: Defs[K] extends { readonly optional: true } ? K : never
}[keyof Defs]

export type PropertyValues<Defs extends PropertyDefs> = {
	[K in Exclude<keyof Defs, OptionalKeys<Defs>>]: ValueOf<Defs[K]>
} & { [K in OptionalKeys<Defs>]?: ValueOf<Defs[K]> }

export const p = {
	enum: <const V extends string>(values: readonly V[], description: string) =>
		({ posthogType: "String", description, values }) as const,
	count: (description: string) => ({ posthogType: "Numeric", description }) as const,
} satisfies Record<string, (...args: never[]) => PropertyDef>

export const optional = <const D extends PropertyDef>(def: D) =>
	({ ...def, optional: true }) as const

export const isPropertyValue = (property: PropertyDef, value: unknown) => {
	switch (property.posthogType) {
		case "String":
			return typeof value === "string" && property.values.includes(value)
		case "Numeric":
			return typeof value === "number" && Number.isFinite(value)
	}
}

export const parseEnum =
	<const V extends string, const F extends V>(values: readonly V[], fallback: F) =>
	(value: string | undefined): V =>
		values.find((known) => known === value) ?? fallback
