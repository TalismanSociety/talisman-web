import { describe, expect, it } from "vitest"
import { environmentOf, isAnalyticsEnabled } from "./environment"

describe("environmentOf", () => {
	it.each([
		["app.talisman.xyz", "production"],
		["talisman.pages.dev", "production"],
		["talisman-portal.talismn.workers.dev", "preview"],
		["abc123-talisman-portal.talismn.workers.dev", "preview"],
		["3f2a9c1e.talisman.pages.dev", "development"],
		["localhost", "development"],
		["127.0.0.1", "development"],
		["talismn.workers.dev.evil.com", "development"],
		["app.talisman.xyz.evil.com", "development"],
	] as const)("%s is %s", (hostname, environment) => {
		expect(environmentOf(hostname)).toBe(environment)
	})
})

describe("isAnalyticsEnabled", () => {
	it("is on in production and preview", () => {
		expect(isAnalyticsEnabled("production", undefined)).toBe(true)
		expect(isAnalyticsEnabled("preview", undefined)).toBe(true)
	})

	it("is off in development unless the local flag is true", () => {
		expect(isAnalyticsEnabled("development", undefined)).toBe(false)
		expect(isAnalyticsEnabled("development", "")).toBe(false)
		expect(isAnalyticsEnabled("development", "1")).toBe(false)
		expect(isAnalyticsEnabled("development", "true")).toBe(true)
	})
})
