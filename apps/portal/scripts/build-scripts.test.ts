// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8")
const rootScripts = JSON.parse(read("../../../package.json")).scripts
const portalScripts = JSON.parse(read("../package.json")).scripts
const viteConfig = read("../vite.config.ts")

describe("build scripts", () => {
	it("builds the Worker, which Workers Builds deploys with build:portal, with frame-ancestors", () => {
		expect(rootScripts["build:portal"]).toContain(" pnpm --filter @talismn/portal build:worker && ")
		expect(portalScripts["build:worker"]).toBe("pnpm run build && node scripts/frame-ancestors.ts")
	})

	it("uploads the source maps of every build, then strips them, checks the client for server secrets, before the CSP header", () => {
		expect(portalScripts.postbuild).toBe(
			"node scripts/posthog-sourcemaps.ts && node scripts/client-secrets.ts && node scripts/csp-headers.ts"
		)
	})

	it("names the release after the commit that Workers Builds builds", () => {
		expect(rootScripts["build:portal"]).toMatch(/^VITE_APP_COMMIT=\$\{WORKERS_CI_COMMIT_SHA:-\} /)
	})

	it("hides the client's maps at the top level, the option vite:css-post reads", () => {
		expect(viteConfig).toMatch(/^\tbuild: \{ sourcemap: "hidden"[,}]/m)
		expect(viteConfig).not.toMatch(/client: \{ build: \{[^\n]*sourcemap/)
	})

	it("keeps the Worker's maps linked as the Cloudflare plugin emits them without a root sourcemap", () => {
		expect(viteConfig).toMatch(/^\t\tssr: \{ build: \{ sourcemap: true \} \},$/m)
	})

	it("keeps vite 7's browser floor for the client's JS, and for CSS at the top level the minifier reads, leaving the Worker on the Cloudflare plugin's target", () => {
		expect(viteConfig).toContain(
			'const viteSevenBrowserFloor = ["chrome107", "edge107", "firefox104", "safari16"]'
		)
		expect(viteConfig).toMatch(/^\t\tclient: \{ build: \{ target: viteSevenBrowserFloor \} \},$/m)
		expect(viteConfig).toMatch(/^\tbuild: \{[^\n]*cssTarget: viteSevenBrowserFloor/m)
		expect(viteConfig).not.toMatch(/^\tbuild: \{[^\n]*\btarget:/m)
	})
})
