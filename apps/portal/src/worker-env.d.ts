declare module "cloudflare:workers" {
	export const env: {
		ASSETS: { fetch: (request: Request) => Promise<Response> }
		TDA_API_KEY: string | undefined
	}
}

interface CacheStorage {
	readonly default: Cache
}
