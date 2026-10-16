import type { AnalyticsEnvironment } from "../../src/domains/analytics/environment"
import type { EventDef } from "../../src/domains/analytics/events"
import type { PropertyDef } from "../../src/domains/analytics/properties"
import type { CatalogSnapshot, EventSpec, PosthogType, SUPER_PROPERTIES } from "./catalog"
import { changedFields, MANAGED_TAG, withTags } from "./reconcile"

export type DefinitionSpec = {
	readonly name: string
	readonly description: string
	readonly tags: readonly string[]
	readonly propertyType?: PosthogType
}

export type StoredDefinition = {
	readonly id: string
	readonly name: string
	readonly description?: string | null
	readonly verified?: boolean
	readonly tags?: readonly string[] | null
	readonly property_type?: string | null
}

export const eventDefinitionSpecs = (catalog: CatalogSnapshot): DefinitionSpec[] =>
	catalog.events.map(({ name, description }) => ({ name, description, tags: [MANAGED_TAG] }))

export const propertyDefinitionSpecs = (catalog: CatalogSnapshot): DefinitionSpec[] =>
	catalog.properties.map(({ name, description, posthogType, isSuper }) => ({
		name,
		description,
		propertyType: posthogType,
		tags: [MANAGED_TAG, ...(isSuper ? ["super"] : [])],
	}))

export const definitionChanges = (spec: DefinitionSpec, stored: StoredDefinition) =>
	changedFields(
		{
			description: stored.description ?? "",
			verified: stored.verified ?? false,
			tags: stored.tags ?? [],
			...(spec.propertyType && { property_type: stored.property_type ?? null }),
		},
		{
			description: spec.description,
			verified: true,
			tags: withTags(stored.tags, spec.tags),
			...(spec.propertyType && { property_type: spec.propertyType }),
		}
	)

export const eventsToSeed = (
	catalog: CatalogSnapshot,
	storedEvents: ReadonlySet<string>,
	storedProperties: ReadonlySet<string>
): EventSpec[] => {
	const seedable = catalog.events.filter((event) => event.seedable)
	const missing = seedable.filter(
		(event) =>
			!storedEvents.has(event.name) || event.properties.some((name) => !storedProperties.has(name))
	)
	const superMissing = catalog.properties.some((p) => p.isSuper && !storedProperties.has(p.name))
	return missing.length || !superMissing ? missing : seedable.slice(0, 1)
}

type SeedValue = string | number | readonly string[]

const SEED_SUPER_PROPERTIES = {
	environment: "development",
} as const satisfies Record<keyof typeof SUPER_PROPERTIES, AnalyticsEnvironment>

const seedValue = (property: PropertyDef): SeedValue => {
	switch (property.posthogType) {
		case "Numeric":
			return 0
		case "String": {
			const first = property.values[0] ?? ""
			return property.list ? [first] : first
		}
	}
}

export type SeedEvent = {
	readonly event: string
	readonly distinct_id: string
	readonly uuid: string
	readonly timestamp: string
	readonly properties: Readonly<Record<string, SeedValue | boolean>>
}

export const seedBatch = (
	events: Readonly<Record<string, EventDef>>,
	names: readonly string[],
	{ distinctId, newUuid, now }: { distinctId: string; newUuid: () => string; now: Date }
): SeedEvent[] =>
	names.flatMap((name) => {
		const def = events[name]
		if (!def) return []
		return {
			event: name,
			distinct_id: distinctId,
			uuid: newUuid(),
			timestamp: now.toISOString(),
			properties: {
				...Object.fromEntries(
					Object.entries(def.properties).map(([key, property]) => [key, seedValue(property)])
				),
				...SEED_SUPER_PROPERTIES,
				$process_person_profile: false,
				$geoip_disable: true,
			},
		}
	})
