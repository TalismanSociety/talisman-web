// @vitest-environment node
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
	cliFailure,
	cliSteps,
	planSourcemapUpload,
	removeSourcemaps,
	runBuildStep,
} from "./posthog-sourcemaps.ts"

const RELEASE = "d42cae12ca014a1d5116ca8ce87dd0c385c437d5"
const KEY = "phx_secretPersonalKey123"

describe("planSourcemapUpload", () => {
	it.each([
		["no key", undefined],
		["an empty key", ""],
		["a blank key", "  "],
	])("skips the upload with %s", (_, apiKey) => {
		expect(planSourcemapUpload(apiKey, RELEASE)).toEqual({
			action: "skip",
			reason: "POSTHOG_API_KEY is not set",
		})
	})

	it.each([
		["no commit", undefined],
		["an empty commit", ""],
	])("skips the upload with %s to name the release", (_, commit) => {
		expect(planSourcemapUpload("phx_key", commit)).toEqual({
			action: "skip",
			reason: "VITE_APP_COMMIT is not set",
		})
	})

	it("uploads for the release the client reports as app_version", () => {
		expect(planSourcemapUpload(" phx_key ", ` ${RELEASE}\n`)).toEqual({
			action: "upload",
			apiKey: "phx_key",
			release: RELEASE,
		})
	})
})

describe("cliSteps", () => {
	it("injects then uploads the client assets only, named after the release", () => {
		const [inject, upload] = cliSteps("/build/dist/client/assets", RELEASE)

		expect(inject).toEqual(
			expect.arrayContaining(["inject", "--directory", "/build/dist/client/assets"])
		)
		expect(upload.join(" ")).toContain(
			"upload --directory /build/dist/client/assets --release-name talisman-portal --release-version " +
				`${RELEASE} --release-mode symbol-set`
		)
	})
})

describe("cliFailure", () => {
	it("names the exit code and keeps the CLI's stderr without the key", () => {
		const failure = cliFailure(
			["dlx", "@posthog/cli", "sourcemap", "inject"],
			{
				status: 1,
				signal: null,
				error: undefined,
				stderr: `Oops! Invalid Personal API key: ${KEY} rejected, phx_otherKey too\n`,
			},
			KEY
		)

		expect(failure.message).toBe(
			"pnpm dlx @posthog/cli sourcemap inject exited with 1\n" +
				"Oops! Invalid Personal API key: <redacted> rejected, <redacted> too"
		)
	})

	it("names the signal and the spawn error of a CLI that timed out", () => {
		const failure = cliFailure(
			["dlx", "@posthog/cli"],
			{ status: null, signal: "SIGTERM", error: new Error("spawnSync pnpm ETIMEDOUT"), stderr: "" },
			KEY
		)

		expect(failure.message).toBe(
			"pnpm dlx @posthog/cli exited with SIGTERM (spawnSync pnpm ETIMEDOUT)"
		)
	})
})

describe("the built client", () => {
	let clientDir = ""
	const write = (path: string, content = "") => {
		mkdirSync(join(clientDir, path, ".."), { recursive: true })
		writeFileSync(join(clientDir, path), content)
	}

	const MAP = JSON.stringify({ version: 3, sources: ["../src/main.tsx"], mappings: "AAAA" })

	const builtClient = () => {
		clientDir = mkdtempSync(join(tmpdir(), "portal-client-"))
		write("assets/main-Ab12Cd34.js")
		write("assets/main-Ab12Cd34.js.map", MAP)
		write("assets/nested/lazy-Zz99Yy88.js.map", MAP)
		write("index.html")
	}
	const sourcemaps = () =>
		["assets/main-Ab12Cd34.js.map", "assets/nested/lazy-Zz99Yy88.js.map"].filter((path) =>
			existsSync(join(clientDir, path))
		)

	afterEach(() => {
		rmSync(clientDir, { recursive: true, force: true })
		vi.restoreAllMocks()
	})

	it("keeps no source map once the build is done", () => {
		builtClient()

		removeSourcemaps(clientDir)

		expect(sourcemaps()).toEqual([])
		expect(existsSync(join(clientDir, "assets/main-Ab12Cd34.js"))).toBe(true)
		expect(existsSync(join(clientDir, "index.html"))).toBe(true)
	})

	it("uploads with the key then removes every source map", () => {
		builtClient()
		const run = vi.fn()

		runBuildStep(clientDir, planSourcemapUpload(KEY, RELEASE), run)

		expect(run.mock.calls).toEqual(
			cliSteps(join(clientDir, "assets"), RELEASE).map((step) => [step, KEY])
		)
		expect(sourcemaps()).toEqual([])
	})

	it("names each script whose map is missing or maps nothing, and still uploads", () => {
		builtClient()
		write("assets/index-Ef56Gh78.js")
		write("assets/index-Ef56Gh78.js.map", JSON.stringify({ version: 3, sources: [], mappings: "" }))
		write("assets/worker-Cc33Dd44.js")
		write("assets/broken-Ij90Kl12.js")
		write("assets/broken-Ij90Kl12.js.map", "{")
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
		const run = vi.fn()

		runBuildStep(clientDir, planSourcemapUpload(KEY, RELEASE), run)

		expect(warn).toHaveBeenCalledExactlyOnceWith(
			"These scripts have no source to map their frames to: broken-Ij90Kl12.js, index-Ef56Gh78.js, worker-Cc33Dd44.js"
		)
		expect(run).toHaveBeenCalledTimes(2)
	})

	it("warns about no script when every map holds its sources", () => {
		builtClient()
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

		runBuildStep(clientDir, planSourcemapUpload(KEY, RELEASE), vi.fn())

		expect(warn).not.toHaveBeenCalled()
	})

	it("goes on with the build and removes every source map when the CLI fails", () => {
		builtClient()
		const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
		const run = vi.fn(() => {
			throw new Error("pnpm dlx @posthog/cli sourcemap inject exited with 1")
		})

		expect(() => runBuildStep(clientDir, planSourcemapUpload(KEY, RELEASE), run)).not.toThrow()

		expect(run).toHaveBeenCalledOnce()
		expect(sourcemaps()).toEqual([])
		expect(existsSync(join(clientDir, "assets/main-Ab12Cd34.js"))).toBe(true)
		expect(log).toHaveBeenCalledExactlyOnceWith(
			"Source maps are not uploaded to PostHog, the build goes on without them:",
			"pnpm dlx @posthog/cli sourcemap inject exited with 1"
		)
	})

	it("never runs the CLI without a key and still removes every source map", () => {
		builtClient()
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
		const run = vi.fn()

		runBuildStep(clientDir, planSourcemapUpload(undefined, RELEASE), run)

		expect(run).not.toHaveBeenCalled()
		expect(sourcemaps()).toEqual([])
		expect(warn).toHaveBeenCalledExactlyOnceWith(
			"Source maps are not uploaded to PostHog: POSTHOG_API_KEY is not set"
		)
	})

	it("names a script that maps nothing on a build without a key too", () => {
		builtClient()
		write("assets/worker-Cc33Dd44.js")
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

		runBuildStep(clientDir, planSourcemapUpload(undefined, RELEASE), vi.fn())

		expect(warn.mock.calls).toEqual([
			["These scripts have no source to map their frames to: worker-Cc33Dd44.js"],
			["Source maps are not uploaded to PostHog: POSTHOG_API_KEY is not set"],
		])
	})
})
