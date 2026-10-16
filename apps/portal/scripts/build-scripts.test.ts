// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8")
const rootScripts = JSON.parse(read("../../../package.json")).scripts
const portalScripts = JSON.parse(read("../package.json")).scripts
const pagesWorkflow = read("../../../.github/workflows/deploy.yml")

describe("build scripts", () => {
	it("builds the Worker, which Workers Builds deploys with build:portal, with frame-ancestors", () => {
		expect(rootScripts["build:portal"]).toContain(" pnpm --filter @talismn/portal build:worker && ")
		expect(portalScripts["build:worker"]).toBe("pnpm run build && node scripts/frame-ancestors.ts")
	})

	it("builds the manual Pages deploy without frame-ancestors", () => {
		expect(portalScripts.build).toBe("tsc -b && vite build")
		expect(portalScripts.postbuild).toBe("node scripts/csp-headers.ts")
		expect(pagesWorkflow).toContain("pnpm --filter @talismn/portal build --sourcemap")
		expect(pagesWorkflow).not.toMatch(/build:worker|build:portal|frame-ancestors/)
	})
})
