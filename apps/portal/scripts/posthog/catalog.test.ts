import { describe, expect, it } from "vitest"
import { EVENTS, isCatalogValue } from "../../src/domains/analytics/events"
import { p } from "../../src/domains/analytics/properties"
import { catalogOf } from "./catalog"
import { eventsToSeed, seedBatch } from "./definitions"

const catalog = catalogOf(EVENTS)

describe("catalogOf", () => {
	it("gives every property name one PostHog type, joining the descriptions of a reused name", () => {
		expect(catalog.errors).toEqual([])
		const names = catalog.properties.map((property) => property.name)
		expect(new Set(names).size).toBe(names.length)
		expect(catalog.properties.find((property) => property.name === "wallet")?.description).toBe(
			[
				"Wallet of the newest connection, by its EIP-6963 id, or other for an unlisted one",
				"Wallet extension, or other for an unlisted one",
			].join(" / ")
		)
	})

	it("types enum lists as strings and counts as numbers", () => {
		const typeOf = (name: string) =>
			catalog.properties.find((property) => property.name === name)?.posthogType
		expect([typeOf("symbols"), typeOf("chains"), typeOf("connections")]).toEqual([
			"String",
			"String",
			"Numeric",
		])
	})

	it("reports a property name two events give different types", () => {
		const conflicting = catalogOf({
			a_seen: { description: "", properties: { size: p.count("Size") } },
			b_seen: { description: "", properties: { size: p.enum(["s", "m"], "Size") } },
		})
		expect(conflicting.errors).toEqual([
			'property "size" has more than one PostHog type: Numeric on a_seen; String on b_seen',
		])
	})

	it("declares $exception with its class, category and mechanism, never seeded", () => {
		expect(catalog.events.find((e) => e.name === "$exception")).toEqual({
			name: "$exception",
			description: "An error report: its class, category and how it was caught, never its message",
			properties: ["exception_type", "error_category", "mechanism", "handled"],
			seedable: false,
		})
		expect(catalog.properties.find((property) => property.name === "handled")).toMatchObject({
			posthogType: "Boolean",
			isSuper: false,
		})
	})

	it("declares environment and app_version as the super properties", () => {
		expect(catalog.properties.filter((property) => property.isSuper)).toEqual([
			{
				name: "environment",
				description: "Where the portal ran: production, a preview Worker or localhost",
				posthogType: "String",
				isSuper: true,
			},
			{
				name: "app_version",
				description: "Git commit the portal was built from, or unknown",
				posthogType: "String",
				isSuper: true,
			},
		])
	})
})

describe("seedBatch", () => {
	let n = 0
	const newUuid = () => `00000000-0000-4000-8000-${String(n++).padStart(12, "0")}`
	const events = eventsToSeed(catalog, new Set(), new Set())
	const batch = seedBatch(
		EVENTS,
		events.map((e) => e.name),
		{ distinctId: newUuid(), newUuid, now: new Date(0) }
	)

	it("seeds every catalog event but $exception", () => {
		expect(batch.map((e) => e.event)).toEqual(Object.keys(EVENTS))
	})

	it("marks every seed as development traffic with no person and no GeoIP", () => {
		for (const { properties } of batch)
			expect(properties).toMatchObject({
				environment: "development",
				app_version: "unknown",
				$process_person_profile: false,
				$geoip_disable: true,
			})
	})

	it("sends only values the client's own catalog accepts", () => {
		for (const { event, properties } of batch)
			for (const [key, value] of Object.entries(properties))
				if (!key.startsWith("$") && key !== "environment" && key !== "app_version")
					expect(isCatalogValue(event, key, value), `${event}.${key}`).toBe(true)
	})

	it("seeds an enum list with its first value and every optional bucket", () => {
		expect(batch.find((e) => e.event === "Report portfolio balances")?.properties).toMatchObject({
			symbols: ["ANLOG"],
			chains: ["1"],
			total_usd: "<10",
			usd_dot: "<10",
			usd_steth: "<10",
		})
		expect(batch.find((e) => e.event === "EVM extensions connected")?.properties).toMatchObject({
			wallet: "injected",
			connections: 0,
		})
	})

	it("seeds nothing once every definition exists", () => {
		const names = new Set(catalog.events.map((e) => e.name))
		const properties = new Set(catalog.properties.map((property) => property.name))
		expect(eventsToSeed(catalog, names, properties)).toEqual([])
	})
})
