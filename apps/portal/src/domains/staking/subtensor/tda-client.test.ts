// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest"

import { createTdaClient } from "./tda-client"

const API_KEY = "00000000-test-4000-8000-000000000000"

const memoryCache = () => {
	const entries = new Map<string, Response>()
	return {
		entries,
		match: vi.fn(async (key: RequestInfo | URL) => entries.get(String(key))?.clone()),
		put: vi.fn(async (key: RequestInfo | URL, response: Response) => {
			entries.set(String(key), response)
		}),
	}
}

describe("createTdaClient", () => {
	const fetch = vi.fn<typeof globalThis.fetch>()
	let cache = memoryCache()

	beforeEach(() => {
		fetch.mockReset()
		cache = memoryCache()
	})

	const count = (payload: unknown) => (payload as unknown[]).length

	it("asks tda for the path with the key header and caches the mapped result", async () => {
		fetch.mockResolvedValue(Response.json([1, 2, 3]))
		const tda = createTdaClient({ apiKey: API_KEY, fetch, cache })

		expect(await tda("/subnets/46/validators", count)).toBe(3)

		expect(fetch).toHaveBeenCalledWith("https://tda.talisman.xyz/subnets/46/validators", {
			headers: { "X-API-Key": API_KEY },
		})
		const cached = cache.entries.get("https://tda.talisman.xyz/subnets/46/validators")
		expect(cached?.headers.get("Cache-Control")).toBe("public, max-age=300")
		expect(await cached?.clone().json()).toBe(3)
	})

	it("answers from the cache without asking tda again", async () => {
		fetch.mockResolvedValue(Response.json([1, 2, 3]))
		const tda = createTdaClient({ apiKey: API_KEY, fetch, cache })

		await tda("/pools", count)
		expect(await tda("/pools", count)).toBe(3)

		expect(fetch).toHaveBeenCalledTimes(1)
	})

	it("fails without asking tda when the key is not configured", async () => {
		const tda = createTdaClient({ apiKey: undefined, fetch, cache })

		await expect(tda("/validators", count)).rejects.toThrow("tda is not configured")
		expect(fetch).not.toHaveBeenCalled()
	})

	it("names the path and status, never the key, when tda refuses", async () => {
		fetch.mockResolvedValue(
			Response.json({ error: { code: "unauthorized", message: API_KEY } }, { status: 401 })
		)
		const tda = createTdaClient({ apiKey: API_KEY, fetch, cache })

		const error = await tda("/validators", count).catch((caught: Error) => caught)

		expect(error).toEqual(new Error("tda /validators responded 401"))
		expect(cache.put).not.toHaveBeenCalled()
	})

	it("caches nothing when the payload does not map", async () => {
		fetch.mockResolvedValue(Response.json({ unexpected: true }))
		const tda = createTdaClient({ apiKey: API_KEY, fetch, cache })

		await expect(
			tda("/pools", () => {
				throw new Error("not a pool list")
			})
		).rejects.toThrow("not a pool list")
		expect(cache.put).not.toHaveBeenCalled()
	})
})
