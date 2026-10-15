// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const config = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"))

describe("wrangler.jsonc", () => {
	it("runs the portal's own server entry", () => {
		expect(config.main).toBe("src/server.ts")
	})

	it("keeps the Worker name the preview noindex rule in _headers matches", () => {
		expect(config.name).toBe("talisman-portal")
	})

	it("serves every app route through the SPA fallback before the Worker runs", () => {
		expect(config.assets).toEqual({
			binding: "ASSETS",
			not_found_handling: "single-page-application",
		})
	})

	it("binds no route, custom domain or zone, so a deploy never reaches a talisman.xyz host", () => {
		const bound = Object.keys(config).filter((key) => /route|domain|zone/i.test(key))
		expect(bound).toEqual([])
		expect(JSON.stringify(config)).not.toMatch(/talisman\.xyz|custom_domain|zone_(id|name)/)
	})
})
