import { afterEach, describe, expect, it, vi } from "vitest"
import { PosthogApi } from "./api"

afterEach(() => vi.unstubAllGlobals())

describe("PosthogApi", () => {
	it("recomputes every query instead of reading PostHog's cache", async () => {
		const fetch = vi.fn(async () => new Response("{}"))
		vi.stubGlobal("fetch", fetch)
		const source = { kind: "TrendsQuery", filterTestAccounts: true }

		await new PosthogApi("https://us.posthog.com", "1", "key", true, false, () => {}).query(source)

		expect(fetch).toHaveBeenCalledOnce()
		const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
		expect(url).toBe("https://us.posthog.com/api/projects/1/query/")
		expect(JSON.parse(init.body as string)).toEqual({ query: source, refresh: "force_blocking" })
	})

	it("sends no write in a dry run, and logs each one instead", async () => {
		const fetch = vi.fn(async () => new Response("{}"))
		vi.stubGlobal("fetch", fetch)
		const lines: string[] = []
		const api = new PosthogApi("https://us.posthog.com", "1", "key", true, false, (line) =>
			lines.push(line)
		)

		await api.post("/dashboards/", { name: "x" })
		await api.patch("/", { anonymize_ips: true })
		await api.delete("/alerts/a/")

		expect(fetch).not.toHaveBeenCalled()
		expect(lines).toEqual([
			"  [dry-run] POST https://us.posthog.com/api/projects/1/dashboards/",
			"  [dry-run] PATCH https://us.posthog.com/api/projects/1/",
			"  [dry-run] DELETE https://us.posthog.com/api/projects/1/alerts/a/",
		])
	})
})
