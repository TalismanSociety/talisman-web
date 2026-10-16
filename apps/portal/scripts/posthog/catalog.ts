import type { AnalyticsEnvironment } from "../../src/domains/analytics/environment"
import type { EventDef } from "../../src/domains/analytics/events"
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
} as const satisfies Readonly<Record<string, PropertyDef>>

const exceptionEvent: EventDef = {
	description: "An error report sent under the Error reporting consent, never its message",
	properties: {},
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
