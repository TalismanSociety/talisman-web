import { env } from "cloudflare:workers"
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

export const rootHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Content-Type-Options": "nosniff",
}

const withRootHeaders = (source: HeadersInit) => {
	const headers = new Headers(source)
	for (const [name, value] of Object.entries(rootHeaders)) headers.set(name, value)
	return headers
}

const isSpaFallback = (response: Response) =>
	response.headers.get("Content-Type")?.startsWith("text/html") ?? false

const serveAsset = async (request: Request) => {
	const response = await env.ASSETS.fetch(request)
	if (!isSpaFallback(response)) return response

	await response.body?.cancel()
	const headers = withRootHeaders(response.headers)
	headers.set("Cache-Control", "no-store")
	headers.delete("Content-Type")
	headers.delete("ETag")
	return new Response(null, { status: 404, headers })
}

const renderWithStart: typeof handler.fetch = async (request, opts) => {
	const response = await handler.fetch(request, opts)
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: withRootHeaders(response.headers),
	})
}

const serveShell: typeof handler.fetch = async (request, opts) => {
	const page = await env.ASSETS.fetch(request)
	if (page.status !== 404) return page

	await page.body?.cancel()
	const shell = await env.ASSETS.fetch(new Request(new URL("/", request.url), request))
	return shell.status === 404 ? renderWithStart(request, opts) : shell
}

export default createServerEntry({
	fetch: (request, opts) => {
		const { pathname } = new URL(request.url)
		if (pathname.startsWith("/assets/")) return serveAsset(request)
		return serveShell(request, opts)
	},
})
