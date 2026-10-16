// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8")
const rootScripts = JSON.parse(read("../../../package.json")).scripts
const portalScripts = JSON.parse(read("../package.json")).scripts
const pagesWorkflow = read("../../../.github/workflows/deploy.yml")
const viteConfig = read("../vite.config.ts")

describe("build scripts", () => {
	it("builds the Worker, which Workers Builds deploys with build:portal, with frame-ancestors", () => {
		expect(rootScripts["build:portal"]).toContain(" pnpm --filter @talismn/portal build:worker && ")
		expect(portalScripts["build:worker"]).toBe("pnpm run build && node scripts/frame-ancestors.ts")
	})

	it("builds the manual Pages deploy without frame-ancestors", () => {
		expect(portalScripts.build).toBe("tsc -b && vite build")
		expect(pagesWorkflow).toContain("pnpm --filter @talismn/portal build\n")
		expect(pagesWorkflow).not.toMatch(/build:worker|build:portal|frame-ancestors/)
	})

	it("uploads the source maps of every build, then strips them, before the CSP header", () => {
		expect(portalScripts.postbuild).toBe(
			"node scripts/posthog-sourcemaps.ts && node scripts/csp-headers.ts"
		)
		expect(pagesWorkflow).toContain("find apps/portal/dist -name '*.map' -type f -delete")
	})

	it("names the release after the commit that Workers Builds and the Pages deploy build", () => {
		expect(rootScripts["build:portal"]).toMatch(/^VITE_APP_COMMIT=\$\{WORKERS_CI_COMMIT_SHA:-\} /)
		expect(pagesWorkflow).toMatch(/^ +VITE_APP_COMMIT=\$\{\{ github\.sha \}\}$/m)
	})

	it("hides the client's maps at the top level, the option vite:css-post reads", () => {
		expect(viteConfig).toContain('\tbuild: { sourcemap: "hidden" },\n')
		expect(viteConfig).not.toMatch(/client: \{ build: \{ sourcemap/)
		expect(pagesWorkflow).not.toContain("--sourcemap")
	})

	it("keeps the Worker's own maps linked for wrangler", () => {
		expect(viteConfig).toContain("environments: { ssr: { build: { sourcemap: true } } }")
	})
})
