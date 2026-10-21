// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { cspHeader, withCspHeader } from "./csp-headers"
import { withFrameAncestors } from "./frame-ancestors"
import { headerRules } from "./headers-file"

const sourceHeaders = readFileSync(new URL("../public/_headers", import.meta.url), "utf8")

const shell = [
	'<html><head><script data-tsr-stream-part="">self.$_TSR={}</script></head>',
	'<body><script type="module" async="" src="/assets/index-abc123.js"></script>',
	"<script>document.currentScript.remove()</script></body></html>",
].join("")

const cspHeaders = withCspHeader(sourceHeaders, cspHeader(shell))
const workerHeaders = withFrameAncestors(cspHeaders)
const rules = headerRules(workerHeaders)

describe("_headers", () => {
	it("caches hashed assets for a year", () => {
		expect(rules.get("/assets/*")?.get("Cache-Control")).toBe("public, max-age=31536000, immutable")
	})

	it("keys cached assets by destination so a navigation's SPA shell never answers a script", () => {
		expect(rules.get("/assets/*")?.get("Vary")).toBe("Sec-Fetch-Dest")
	})

	it("leaves the shell and every other path on Cloudflare's revalidating default", () => {
		const cachedPaths = [...rules].filter(([, headers]) => headers.has("Cache-Control"))
		expect(cachedPaths.map(([path]) => path)).toEqual(["/assets/*"])
	})

	it("keeps preview and version hosts out of search, and nothing else", () => {
		const noindexPaths = [...rules].filter(([, headers]) => headers.has("X-Robots-Tag"))
		expect(noindexPaths.map(([path, headers]) => [path, headers.get("X-Robots-Tag")])).toEqual([
			["https://:preview-talisman-portal.:subdomain.workers.dev/*", "noindex"],
		])
	})

	it("ships the CSP in report-only mode and enforces only frame-ancestors, on every path", () => {
		const rootHeaders = [...(rules.get("/*")?.keys() ?? [])]
		expect(rootHeaders).toEqual([
			"Access-Control-Allow-Origin",
			"Referrer-Policy",
			"X-Content-Type-Options",
			"Content-Security-Policy-Report-Only",
			"Content-Security-Policy",
		])
	})

	it("lets only the portal itself, Signet and our workers.dev hosts frame the Worker", () => {
		expect(rules.get("/*")?.get("Content-Security-Policy")).toBe(
			"frame-ancestors 'self' https://signet.talisman.xyz https://*.talismn.workers.dev"
		)
		expect(workerHeaders.match(/frame-ancestors[^;\n]*/gi)).toEqual([
			"frame-ancestors 'self' https://signet.talisman.xyz https://*.talismn.workers.dev",
		])
	})

	it("never sends X-Frame-Options", () => {
		expect(workerHeaders).not.toMatch(/x-frame-options/i)
	})
})

describe("withFrameAncestors", () => {
	it("refuses a _headers file whose /* block already sets a Content-Security-Policy", () => {
		expect(() => withFrameAncestors(workerHeaders)).toThrow(
			"The /* block of _headers already sets Content-Security-Policy"
		)
		expect(() => withFrameAncestors("/*\n  content-security-policy: default-src 'self'")).toThrow(
			"The /* block of _headers already sets Content-Security-Policy"
		)
	})
})

describe("cspHeader", () => {
	it("allows the shell's inline scripts by hash, wasm, and the sources the portal loads", () => {
		expect(cspHeader(shell).split("; ")).toEqual([
			"default-src 'self'",
			"script-src 'self' 'wasm-unsafe-eval' 'sha256-s78eJFAKThpAHttUBoue+mb8FAxQlEk1xMSKUFlhBXs=' 'sha256-FaFkoXjhIeCM3lyKXkAbhu1z9AUQTBId0sahMexEGEs='",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"img-src 'self' data: blob: https:",
			"font-src 'self' https://fonts.gstatic.com",
			"connect-src 'self' https: wss:",
			"frame-src https://stake.lido.fi",
			"worker-src 'self' blob:",
			"object-src 'none'",
			"base-uri 'none'",
			"form-action 'self'",
		])
	})

	it("hashes a script the way the browser parses it", () => {
		expect(cspHeader("<script>a\0b</script>")).toContain(
			"'sha256-BQh4Ezku/Bb+j/RIkgxjKOU6+GXfOUGUNmWdn/2pD3s='"
		)
		expect(cspHeader("<script>a\r\nb</script>")).toContain(
			"'sha256-fhj3NzEbLcOy8mndeDlrA1HxT7Zu+oefdoyyMYGIPHg='"
		)
	})

	it("hashes inline scripts whatever the tag case", () => {
		expect(cspHeader('<SCRIPT>a\nb</SCRIPT ><Script SRC="/assets/index.js"></Script>')).toContain(
			"script-src 'self' 'wasm-unsafe-eval' 'sha256-fhj3NzEbLcOy8mndeDlrA1HxT7Zu+oefdoyyMYGIPHg=';"
		)
	})

	it("refuses a shell without inline scripts", () => {
		expect(() => cspHeader('<script src="/assets/index.js"></script>')).toThrow(
			"No inline script in the shell to hash"
		)
	})
})

describe("withCspHeader", () => {
	it("appends the policy to the /* block only", () => {
		expect(withCspHeader("/*\n  A: b\n\n/assets/*\n  C: d", "default-src 'self'")).toBe(
			"/*\n  A: b\n  Content-Security-Policy-Report-Only: default-src 'self'\n\n/assets/*\n  C: d"
		)
	})

	it("refuses a line over Cloudflare's 2000-character limit", () => {
		const fits = "x".repeat(1999 - "  Content-Security-Policy-Report-Only: ".length)
		expect(withCspHeader(sourceHeaders, fits)).toContain(fits)
		expect(() => withCspHeader(sourceHeaders, `${fits}x`)).toThrow(
			"Content-Security-Policy-Report-Only line is 2000 characters, Cloudflare caps _headers lines at 2000"
		)
	})

	it("refuses a _headers file that does not start with the /* block", () => {
		expect(() => withCspHeader("/assets/*\n  C: d", "default-src 'self'")).toThrow(
			"_headers does not start with the /* block"
		)
	})
})
