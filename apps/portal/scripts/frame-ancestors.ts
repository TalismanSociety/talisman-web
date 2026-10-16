import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { withRootHeader } from "./headers-file.ts"

export const frameAncestors =
	"frame-ancestors 'self' https://signet.talisman.xyz https://*.talismn.workers.dev"

export const withFrameAncestors = (headers: string) =>
	withRootHeader(headers, "Content-Security-Policy", frameAncestors)

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const headersUrl = new URL("../dist/client/_headers", import.meta.url)
	writeFileSync(headersUrl, withFrameAncestors(readFileSync(headersUrl, "utf8")))
}
