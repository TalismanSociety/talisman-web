export const TDA_ORIGIN = "https://tda.talisman.xyz"
export const TDA_CACHE_SECONDS = 300

export type TdaPath = "/validators" | "/pools" | `/subnets/${number}/validators`

type TdaClientDeps = {
	apiKey: string | undefined
	fetch: typeof fetch
	cache: Pick<Cache, "match" | "put"> | undefined
}

export const createTdaClient =
	({ apiKey, fetch, cache }: TdaClientDeps) =>
	async <T>(path: TdaPath, map: (payload: unknown) => T): Promise<T> => {
		if (!apiKey) throw new Error("tda is not configured")

		const cacheKey = `${TDA_ORIGIN}${path}`
		const cached = await cache?.match(cacheKey)
		if (cached) return (await cached.json()) as T

		const response = await fetch(cacheKey, { headers: { "X-API-Key": apiKey } })
		if (!response.ok) throw new Error(`tda ${path} responded ${response.status}`)

		const mapped = map(await response.json())
		await cache?.put(
			cacheKey,
			new Response(JSON.stringify(mapped), {
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": `public, max-age=${TDA_CACHE_SECONDS}`,
				},
			})
		)
		return mapped
	}
