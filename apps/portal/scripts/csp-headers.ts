import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const CLOUDFLARE_HEADERS_LINE_LIMIT = 2000

const scriptHashes = (html: string) =>
	[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script[^>]*>/gi)]
		.filter(([, attributes = ""]) => !/\bsrc\s*=/i.test(attributes))
		.map(([, , body = ""]) => {
			const parsedBody = body.replaceAll(/\r\n?/g, "\n").replaceAll("\0", "\uFFFD")
			return `'sha256-${createHash("sha256").update(parsedBody, "utf8").digest("base64")}'`
		})

export const cspHeader = (html: string) => {
	const hashes = scriptHashes(html)
	if (!hashes.length) throw new Error("No inline script in the shell to hash")

	const directives: ReadonlyArray<readonly [string, readonly string[]]> = [
		["default-src", ["'self'"]],
		["script-src", ["'self'", "'wasm-unsafe-eval'", ...hashes]],
		["style-src", ["'self'", "'unsafe-inline'"]],
		["img-src", ["'self'", "data:", "blob:", "https:"]],
		["font-src", ["'self'"]],
		["connect-src", ["'self'", "https:", "wss:"]],
		["frame-src", ["https://stake.lido.fi"]],
		["worker-src", ["'self'", "blob:"]],
		["object-src", ["'none'"]],
		["base-uri", ["'none'"]],
		["form-action", ["'self'"]],
	]
	return directives.map(([directive, sources]) => [directive, ...sources].join(" ")).join("; ")
}

export const withCspHeader = (headers: string, policy: string) => {
	const line = `  Content-Security-Policy-Report-Only: ${policy}`
	if (line.length >= CLOUDFLARE_HEADERS_LINE_LIMIT)
		throw new Error(
			`CSP line is ${line.length} characters, Cloudflare caps _headers lines at ${CLOUDFLARE_HEADERS_LINE_LIMIT}`
		)

	const [rootBlock = "", ...otherBlocks] = headers.split("\n\n")
	if (!rootBlock.startsWith("/*\n")) throw new Error("_headers does not start with the /* block")
	return [`${rootBlock}\n${line}`, ...otherBlocks].join("\n\n")
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const html = readFileSync(new URL("../dist/client/index.html", import.meta.url), "utf8")
	const headersUrl = new URL("../dist/client/_headers", import.meta.url)
	writeFileSync(headersUrl, withCspHeader(readFileSync(headersUrl, "utf8"), cspHeader(html)))
}
