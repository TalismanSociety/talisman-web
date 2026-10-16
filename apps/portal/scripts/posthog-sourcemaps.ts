import { type SpawnSyncReturns, spawnSync } from "node:child_process"
import { readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { POSTHOG_PROJECT_ID, POSTHOG_UI_HOST } from "../src/domains/analytics/posthogProject.ts"

const POSTHOG_CLI = "@posthog/cli@0.18.3"
const RELEASE_NAME = "talisman-portal"
const CLI_STEP_TIMEOUT_MS = 5 * 60_000
const CLI_STDERR_MAX_BYTES = 64 * 1024 * 1024
const CLI_ENV_ALLOWLIST = [
	"PATH",
	"HOME",
	"TMPDIR",
	"PNPM_HOME",
	"XDG_CACHE_HOME",
	"XDG_DATA_HOME",
] as const

export type SourcemapPlan =
	| { action: "skip"; reason: string }
	| { action: "upload"; apiKey: string; release: string }

export const planSourcemapUpload = (
	apiKey: string | undefined,
	commit: string | undefined
): SourcemapPlan => {
	const key = apiKey?.trim()
	const release = commit?.trim()
	if (!key) return { action: "skip", reason: "POSTHOG_API_KEY is not set" }
	if (!release) return { action: "skip", reason: "VITE_APP_COMMIT is not set" }
	return { action: "upload", apiKey: key, release }
}

export const cliSteps = (assetsDir: string, release: string) => {
	const sourcemap = ["dlx", POSTHOG_CLI, "--host", POSTHOG_UI_HOST, "sourcemap"]
	return [
		[...sourcemap, "inject", "--directory", assetsDir],
		[
			...sourcemap,
			"upload",
			"--directory",
			assetsDir,
			"--release-name",
			RELEASE_NAME,
			"--release-version",
			release,
			"--release-mode",
			"symbol-set",
			"--skip-on-conflict",
		],
	] as const
}

const filesIn = (dir: string, extension: string) =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(extension))
		.map((entry) => join(entry.parentPath, entry.name))

export const removeSourcemaps = (clientDir: string) => {
	for (const file of filesIn(clientDir, ".map")) rmSync(file)
}

type RunCli = (args: readonly string[], apiKey: string) => void

const redact = (text: string, apiKey: string) =>
	text.replaceAll(apiKey, "<redacted>").replace(/phx_\w+/g, "<redacted>")

export const cliFailure = (
	args: readonly string[],
	{
		status,
		signal,
		error,
		stderr,
	}: Pick<SpawnSyncReturns<string>, "status" | "signal" | "error" | "stderr">,
	apiKey: string
) =>
	new Error(
		[
			`pnpm ${args.join(" ")} exited with ${status ?? signal}${error ? ` (${error.message})` : ""}`,
			redact(stderr ?? "", apiKey).trim(),
		]
			.filter(Boolean)
			.join("\n")
	)

const runCli: RunCli = (args, apiKey) => {
	const result = spawnSync("pnpm", args, {
		cwd: tmpdir(),
		stdio: ["ignore", "inherit", "pipe"],
		encoding: "utf8",
		maxBuffer: CLI_STDERR_MAX_BYTES,
		timeout: CLI_STEP_TIMEOUT_MS,
		env: {
			...Object.fromEntries(
				CLI_ENV_ALLOWLIST.flatMap((name) => (process.env[name] ? [[name, process.env[name]]] : []))
			),
			POSTHOG_CLI_API_KEY: apiKey,
			POSTHOG_CLI_PROJECT_ID: POSTHOG_PROJECT_ID,
			NO_COLOR: "1",
		},
	})
	if (result.status !== 0) throw cliFailure(args, result, apiKey)
	process.stderr.write(redact(result.stderr, apiKey))
}

const uploadSourcemaps = (plan: SourcemapPlan, assetsDir: string, run: RunCli) => {
	if (plan.action === "skip") {
		console.warn(`Source maps are not uploaded to PostHog: ${plan.reason}`)
		return
	}
	const [inject, upload] = cliSteps(assetsDir, plan.release)
	run(inject, plan.apiKey)
	run(upload, plan.apiKey)
}

export const runBuildStep = (clientDir: string, plan: SourcemapPlan, run: RunCli = runCli) => {
	try {
		uploadSourcemaps(plan, join(clientDir, "assets"), run)
	} catch (error) {
		console.error(
			"Source maps are not uploaded to PostHog, the build goes on without them:",
			error instanceof Error ? error.message : error
		)
	} finally {
		removeSourcemaps(clientDir)
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url))
	runBuildStep(
		fileURLToPath(new URL("../dist/client", import.meta.url)),
		planSourcemapUpload(process.env["POSTHOG_API_KEY"], process.env["VITE_APP_COMMIT"])
	)
