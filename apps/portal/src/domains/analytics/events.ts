import type { ConsentKind } from "./consent"
import { extensionEvents } from "./events/extensions"
import { pageEvents } from "./events/pages"
import { portfolioEvents } from "./events/portfolio"
import { transactionEvents } from "./events/transactions"
import { isPropertyValue, type PropertyDefs, type PropertyValues } from "./properties"

type EventDef = {
	readonly description: string
	readonly properties: PropertyDefs
}

export type EventGroup = Readonly<Record<string, EventDef>>

type UnionToIntersection<U> = (U extends unknown ? (union: U) => void : never) extends (
	intersection: infer I
) => void
	? I
	: never

type DuplicateNames<Gs extends readonly EventGroup[], Seen = never> = Gs extends readonly [
	infer Head extends EventGroup,
	...infer Tail extends readonly EventGroup[],
]
	? (keyof Head & Seen) | DuplicateNames<Tail, Seen | keyof Head>
	: never

type NoDuplicateEvents<Gs extends readonly EventGroup[]> = [DuplicateNames<Gs>] extends [never]
	? unknown
	: { readonly duplicateEvent: DuplicateNames<Gs> }

export const mergeEventGroups = <const Gs extends readonly EventGroup[]>(
	...groups: Gs & NoDuplicateEvents<Gs>
) => {
	const merged: Record<string, EventDef> = {}
	for (const group of groups)
		for (const [name, def] of Object.entries(group)) {
			if (Object.hasOwn(merged, name)) throw new Error(`Duplicate analytics event "${name}"`)
			merged[name] = def
		}
	return merged as UnionToIntersection<Gs[number]>
}

export const EVENTS = mergeEventGroups(
	pageEvents,
	extensionEvents,
	portfolioEvents,
	transactionEvents
)

export type EventName = keyof typeof EVENTS

type PropertiesOf<E extends EventName> = (typeof EVENTS)[E]["properties"]

type EventProps<E extends EventName> = PropertyValues<PropertiesOf<E>>

export type TrackArgs<E extends EventName> = keyof PropertiesOf<E> extends never
	? []
	: Record<never, never> extends EventProps<E>
		? [props?: EventProps<E>]
		: [props: EventProps<E>]

const catalogPropertyOf = (eventName: string, key: string) => {
	const properties = Object.hasOwn(EVENTS, eventName)
		? (EVENTS as Readonly<Record<string, EventDef>>)[eventName]?.properties
		: undefined
	return properties && Object.hasOwn(properties, key) ? properties[key] : undefined
}

export const isCatalogValue = (eventName: string, key: string, value: unknown) => {
	const property = catalogPropertyOf(eventName, key)
	return property !== undefined && isPropertyValue(property, value)
}

export const consentKindOf = (eventName: string): ConsentKind | undefined =>
	Object.hasOwn(EVENTS, eventName) ? "analytics" : undefined
