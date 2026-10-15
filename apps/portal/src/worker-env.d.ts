declare module "cloudflare:workers" {
	export const env: { ASSETS: { fetch: (request: Request) => Promise<Response> } }
}
