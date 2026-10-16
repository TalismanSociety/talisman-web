import type { AnalyticsEnvironment } from "../../src/domains/analytics/environment"
import { ERROR_CATEGORIES } from "../../src/domains/analytics/errorCategory"
import type { EventDef } from "../../src/domains/analytics/events"
import {
	ERROR_CLASSES,
	EXCEPTION_MECHANISMS,
	type ExceptionProperties,
} from "../../src/domains/analytics/exception"
import { type PropertyDef, p } from "../../src/domains/analytics/properties"

export type PosthogType = PropertyDef["posthogType"]

type PropertySpec = {
	readonly name: string
	readonly description: string
	readonly posthogType: PosthogType
	readonly isSuper: boolean
}

export type EventSpec = {
	readonly name: string
	readonly description: string
	readonly properties: readonly string[]
	readonly seedable: boolean
}

export type CatalogSnapshot = {
	readonly events: readonly EventSpec[]
	readonly properties: readonly PropertySpec[]
	readonly errors: readonly string[]
}

export const EXCEPTION_EVENT = "$exception"

const ENVIRONMENTS = [
	"production",
	"preview",
	"development",
] as const satisfies readonly AnalyticsEnvironment[]

export const SUPER_PROPERTIES = {
	environment: p.enum(
		ENVIRONMENTS,
		"Where the portal ran: production, a preview Worker or localhost"
	),
	app_version: {
		posthogType: "String",
		description: "Git commit the portal was built from, or unknown",
	},
} as const satisfies Readonly<
	Record<string, { readonly posthogType: PosthogType; readonly description: string }>
>

const EXCEPTION_PROPERTIES = {
	exception_type: p.enum(
		[...ERROR_CLASSES],
		"Class of the thrown error from the allowlist, or Error for any other thrown value"
	),
	error_category: p.enum(ERROR_CATEGORIES, "Category of the error, never its message"),
	mechanism: p.enum(
		EXCEPTION_MECHANISMS,
		"How the error reached the reporter: caught by a call site, uncaught, an unhandled rejection or an error boundary"
	),
	handled: p.bool(
		"Whether the app recovered: a call site caught it or an error boundary showed it"
	),
} as const satisfies {
	readonly [K in Exclude<keyof ExceptionProperties, `$${string}`>]: PropertyDef
}

const exceptionEvent: EventDef = {
	description: "An error report: its class, category and how it was caught, never its message",
	properties: EXCEPTION_PROPERTIES,
}

const propertiesOf = (events: Readonly<Record<string, EventDef>>) => {
	const merged = new Map<string, { descriptions: Set<string>; types: Map<PosthogType, string[]> }>()
	for (const [event, { properties }] of Object.entries(events))
		for (const [name, def] of Object.entries(properties)) {
			const entry = merged.get(name) ?? { descriptions: new Set(), types: new Map() }
			entry.descriptions.add(def.description)
			entry.types.set(def.posthogType, [...(entry.types.get(def.posthogType) ?? []), event])
			merged.set(name, entry)
		}
	const errors = [...merged].flatMap(([name, { types }]) =>
		types.size > 1
			? [
					`property "${name}" has more than one PostHog type: ${[...types]
						.map(([type, events]) => `${type} on ${events.join(", ")}`)
						.join("; ")}`,
				]
			: []
	)
	const properties = [...merged].map(
		([name, { descriptions, types }]): PropertySpec => ({
			name,
			description: [...descriptions].join(" / "),
			posthogType: [...types.keys()][0] ?? "String",
			isSuper: false,
		})
	)
	return { properties, errors }
}

export const catalogOf = (events: Readonly<Record<string, EventDef>>): CatalogSnapshot => {
	const all = { ...events, [EXCEPTION_EVENT]: exceptionEvent }
	const { properties, errors } = propertiesOf(all)
	const superProperties = Object.entries(SUPER_PROPERTIES).map(
		([name, def]): PropertySpec => ({
			name,
			description: def.description,
			posthogType: def.posthogType,
			isSuper: true,
		})
	)
	return {
		events: Object.entries(all).map(([name, def]) => ({
			name,
			description: def.description,
			properties: Object.keys(def.properties),
			seedable: name !== EXCEPTION_EVENT,
		})),
		properties: [...properties, ...superProperties],
		errors,
	}
}
