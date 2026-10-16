// @vitest-environment node
import { readFileSync } from "node:fs"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { withFrameAncestors } from "../scripts/frame-ancestors"
import { headerRules } from "../scripts/headers-file"

const { assetsFetch, startFetch } = vi.hoisted(() => ({
	assetsFetch: vi.fn<(request: Request) => Promise<Response>>(),
	startFetch: vi.fn<(request: Request) => Promise<Response>>(),
}))

vi.mock("cloudflare:workers", () => ({ env: { ASSETS: { fetch: assetsFetch } } }))
vi.mock("@tanstack/react-start/server-entry", () => ({
	default: { fetch: startFetch },
	createServerEntry: <T>(entry: T) => entry,
}))

const { default: entry, rootHeaders } = await import("./server")

const rootRule = Object.fromEntries(
	headerRules(
		withFrameAncestors(readFileSync(new URL("../public/_headers", import.meta.url), "utf8"))
	).get("/*") ?? []
)

const rootHeadersOf = (response: Response) =>
	Object.fromEntries(Object.keys(rootRule).map((name) => [name, response.headers.get(name)]))

const assetHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Content-Type-Options": "nosniff",
	"Cache-Control": "public, max-age=0, must-revalidate",
	ETag: '"abc"',
}

const shellHeaders = { ...assetHeaders, "Content-Type": "text/html; charset=utf-8" }

const serve = (path: string, init?: RequestInit) =>
	entry.fetch(new Request(`https://portal.test${path}`, init))

const requestedPaths = () =>
	assetsFetch.mock.calls.map(([request]) => {
		const url = new URL(request.url)
		return url.pathname + url.search
	})

describe("server entry", () => {
	beforeEach(() => {
		assetsFetch.mockReset()
		startFetch.mockReset()
	})

	it("serves an existing asset with its headers", async () => {
		assetsFetch.mockResolvedValue(
			new Response("export {}", {
				headers: { ...assetHeaders, "Content-Type": "text/javascript" },
			})
		)

		const response = await serve("/assets/index-abc123.js")

		expect(response.status).toBe(200)
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
		expect(response.headers.get("Cache-Control")).toBe("public, max-age=0, must-revalidate")
		expect(await response.text()).toBe("export {}")
	})

	it("passes a revalidated asset through", async () => {
		assetsFetch.mockResolvedValue(
			new Response(null, {
				status: 304,
				headers: { ...assetHeaders, "Content-Type": "text/javascript" },
			})
		)

		const response = await serve("/assets/index-abc123.js", {
			headers: { "If-None-Match": '"abc"' },
		})

		expect(response.status).toBe(304)
		expect(response.headers.get("ETag")).toBe('"abc"')
	})

	it.each(["text/html", "text/html; charset=utf-8"])(
		"answers a missing asset served as %s with an uncacheable 404 instead of the SPA shell",
		async (contentType) => {
			assetsFetch.mockResolvedValue(
				new Response("<!DOCTYPE html><html></html>", {
					headers: { ...assetHeaders, "Content-Type": contentType },
				})
			)

			const response = await serve("/assets/index-gone00.js")

			expect(response.status).toBe(404)
			expect(response.headers.get("Cache-Control")).toBe("no-store")
			expect(response.headers.get("Content-Type")).toBeNull()
			expect(response.headers.get("ETag")).toBeNull()
			expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
			expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*")
			expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin")
			expect(await response.text()).toBe("")
		}
	)

	it("answers a revalidated missing asset with an uncacheable 404 instead of the shell's 304", async () => {
		assetsFetch.mockResolvedValue(new Response(null, { status: 304, headers: shellHeaders }))

		const response = await serve("/assets/index-gone00.js", {
			headers: { "If-None-Match": '"abc"' },
		})

		expect(response.status).toBe(404)
		expect(response.headers.get("Cache-Control")).toBe("no-store")
		expect(response.headers.get("ETag")).toBeNull()
	})

	it("serves an app route with the shell the assets fall back to", async () => {
		assetsFetch.mockResolvedValue(new Response("<!DOCTYPE html>", { headers: shellHeaders }))

		const response = await serve("/staking/providers?action=stake&type=seek")

		expect(await response.text()).toBe("<!DOCTYPE html>")
		expect(requestedPaths()).toEqual(["/staking/providers?action=stake&type=seek"])
		expect(startFetch).not.toHaveBeenCalled()
	})

	it("serves a deep link with the root shell where the assets have no SPA fallback", async () => {
		assetsFetch.mockImplementation(async (request) =>
			new URL(request.url).pathname === "/"
				? new Response("<!DOCTYPE html>", { headers: shellHeaders })
				: new Response(null, { status: 404 })
		)

		const response = await serve("/staking/providers?action=stake&type=seek")

		expect(response.status).toBe(200)
		expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8")
		expect(await response.text()).toBe("<!DOCTYPE html>")
		expect(requestedPaths()).toEqual(["/staking/providers?action=stake&type=seek", "/"])
		expect(startFetch).not.toHaveBeenCalled()
	})

	it("renders through TanStack Start before the shell is built", async () => {
		assetsFetch.mockResolvedValue(new Response(null, { status: 404 }))
		startFetch.mockResolvedValue(new Response("prerendered"))

		const response = await serve("/")

		expect(await response.text()).toBe("prerendered")
	})

	it("answers a server function call through TanStack Start, never with the shell", async () => {
		assetsFetch.mockResolvedValue(new Response("<!DOCTYPE html>", { headers: shellHeaders }))
		startFetch.mockResolvedValue(
			new Response('{"result":[]}', {
				headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
			})
		)

		const response = await serve("/_serverFn/abc123?payload=%7B%7D")

		expect(await response.text()).toBe('{"result":[]}')
		expect(response.headers.get("Cache-Control")).toBe("public, max-age=300")
		expect(rootHeadersOf(response)).toEqual(rootRule)
		expect(assetsFetch).not.toHaveBeenCalled()
	})

	it("builds its responses with the headers the Worker's _headers sets on every path", () => {
		expect(rootHeaders).toEqual(rootRule)
		expect(rootRule).toEqual({
			"Access-Control-Allow-Origin": "*",
			"Referrer-Policy": "strict-origin-when-cross-origin",
			"X-Content-Type-Options": "nosniff",
			"Content-Security-Policy":
				"frame-ancestors 'self' https://signet.talisman.xyz https://*.talismn.workers.dev",
		})
	})

	it("adds the _headers root headers to a missing asset's 404 when the assets omit them", async () => {
		assetsFetch.mockResolvedValue(
			new Response("<!DOCTYPE html>", { headers: { "Content-Type": "text/html" } })
		)

		const response = await serve("/assets/index-gone00.js")

		expect(response.status).toBe(404)
		expect(rootHeadersOf(response)).toEqual(rootRule)
	})

	it("adds the _headers root headers to what TanStack Start renders", async () => {
		assetsFetch.mockResolvedValue(new Response(null, { status: 404 }))
		startFetch.mockResolvedValue(
			new Response("prerendered", { status: 200, headers: { "Content-Type": "text/html" } })
		)

		const response = await serve("/staking")

		expect(await response.text()).toBe("prerendered")
		expect(response.headers.get("Content-Type")).toBe("text/html")
		expect(rootHeadersOf(response)).toEqual(rootRule)
	})
})
