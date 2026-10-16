import { execFileSync } from "node:child_process"
import { existsSync } from "node:fs"
import { parseArgs } from "node:util"
import { config } from "dotenv"
import { EVENTS } from "../../src/domains/analytics/events"
import { POSTHOG_API_HOST, POSTHOG_UI_HOST } from "../../src/domains/analytics/posthogProject"
import { ingest, type Log, PosthogApi } from "./api"
import { catalogOf } from "./catalog"
import { ALERTS, DASHBOARDS, dashboardName, insightName, specErrors } from "./dashboards"
import { runProvisioning } from "./run"

const DEFAULT_ENV_FILE = ".env"

const USAGE = `
Usage: pnpm --filter @talismn/portal posthog:provision [flags]

Env (apps/portal/.env, or the file --env-file names):
  POSTHOG_API_KEY           Personal API key (scopes in scripts/posthog/README.md)
  POSTHOG_PROJECT_ID        The portal's PostHog project id
  VITE_POSTHOG_AUTH_TOKEN   Project token, needed by --seed only

Flags:
  --env-file <path>     Read the env from this file instead of ${DEFAULT_ENV_FILE}
  --dry-run             Read the live project and print what would change; write nothing.
                        Without credentials, print the plan only
  --check-queries       Run every tile's query through /query/ (writes nothing)
  --seed                Send one development event per catalog event PostHog has no
                        definition for, then wait for the definitions
  --only <slug>         Reconcile one dashboard (repeatable)
  --prune               Soft-delete managed insights and alerts no longer in the spec
  --skip-definitions    Leave event and property definitions alone
  --skip-settings       Leave the project settings and test-account filter alone
  --show-test-accounts  Save insights with the test-account filter off
  --verbose             Print request bodies
  --help                Print this help
`.trim()

const log: Log = (line) => process.stdout.write(`${line}\n`)
const fail = (message: string): never => {
	process.stderr.write(`${message}\n`)
	process.exit(2)
}

const loadEnv = (path: string | undefined) => {
	const file = path ?? DEFAULT_ENV_FILE
	if (existsSync(file)) config({ path: file })
	else if (path !== undefined) fail(`--env-file ${path} does not exist`)
}

const parseCli = () => {
	const { values } = parseArgs({
		options: {
			"env-file": { type: "string" },
			"dry-run": { type: "boolean", default: false },
			"check-queries": { type: "boolean", default: false },
			seed: { type: "boolean", default: false },
			only: { type: "string", multiple: true, default: [] },
			prune: { type: "boolean", default: false },
			"skip-definitions": { type: "boolean", default: false },
			"skip-settings": { type: "boolean", default: false },
			"show-test-accounts": { type: "boolean", default: false },
			verbose: { type: "boolean", default: false },
			help: { type: "boolean", short: "h", default: false },
		},
		strict: true,
	})
	if (values.help) {
		log(USAGE)
		process.exit(0)
	}
	loadEnv(values["env-file"])
	return {
		dryRun: values["dry-run"] === true,
		checkQueries: values["check-queries"] === true,
		seed: values.seed === true,
		only: values.only ?? [],
		prune: values.prune === true,
		skipDefinitions: values["skip-definitions"] === true,
		skipSettings: values["skip-settings"] === true,
		filterTestAccounts: values["show-test-accounts"] !== true,
		verbose: values.verbose === true,
		apiKey: process.env["POSTHOG_API_KEY"] || undefined,
		projectId: process.env["POSTHOG_PROJECT_ID"] || undefined,
		projectToken: process.env["VITE_POSTHOG_AUTH_TOKEN"] || undefined,
	}
}

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trim()

const main = async () => {
	const cli = parseCli()
	const catalog = catalogOf(EVENTS)
	const dashboards = DASHBOARDS
	const unknown = cli.only.filter((slug) => !dashboards.some((d) => d.slug === slug))
	if (unknown.length)
		fail(
			`Unknown --only slug(s): ${unknown.join(", ")}. Known: ${dashboards.map((d) => d.slug).join(", ")}`
		)
	const selected = cli.only.length
		? dashboards.filter((d) => cli.only.includes(d.slug))
		: dashboards

	log(
		`Head         ${git("rev-parse", "HEAD")}${git("status", "--porcelain") ? " with uncommitted changes" : ""}`
	)
	log(`API host     ${POSTHOG_UI_HOST}`)
	log(`Ingest host  ${POSTHOG_API_HOST}`)
	log(`Project      ${cli.projectId ?? "(POSTHOG_PROJECT_ID unset)"}`)
	log(`Catalog      ${catalog.events.length} events, ${catalog.properties.length} properties`)
	log(`Test users   ${cli.filterTestAccounts ? "filtered (production hosts only)" : "shown"}`)
	log(
		`Mode         ${cli.dryRun ? "dry run" : "write"}${cli.seed ? " + seed" : ""}${cli.prune ? " + prune" : ""}${cli.checkQueries ? " + query check" : ""}`
	)
	log("\nPlan:")
	for (const spec of selected) {
		log(`  ${dashboardName(dashboards, spec)}  [${spec.slug}]`)
		for (const tile of spec.tiles)
			log(`    - ${insightName(dashboards, spec, tile)}  (${tile.query.source.kind})`)
	}
	log(`  Alerts: ${ALERTS.map((a) => `${a.name} on "${a.tile}"`).join("; ")}`)

	const errors = specErrors(dashboards, ALERTS, catalog)
	if (errors.length) {
		log(`\nThe spec disagrees with the catalog (${errors.length}):`)
		for (const error of errors) log(`  - ${error}`)
		if (!cli.dryRun) process.exit(1)
	}
	if (!cli.apiKey || !cli.projectId) {
		if (cli.dryRun) {
			log("\nNo POSTHOG_API_KEY or POSTHOG_PROJECT_ID: plan only.")
			process.exitCode = errors.length ? 1 : 0
			return
		}
		fail("POSTHOG_API_KEY and POSTHOG_PROJECT_ID are required")
		return
	}
	const { projectToken } = cli
	if (cli.seed && !cli.dryRun && !projectToken) fail("--seed needs VITE_POSTHOG_AUTH_TOKEN")

	const api = new PosthogApi(
		POSTHOG_UI_HOST,
		cli.projectId,
		cli.apiKey,
		cli.dryRun,
		cli.verbose,
		log
	)
	const result = await runProvisioning({
		api,
		log,
		events: EVENTS,
		catalog,
		dashboards,
		selected,
		options: {
			seed: cli.seed,
			checkQueries: cli.checkQueries,
			prune: cli.prune,
			skipDefinitions: cli.skipDefinitions,
			skipSettings: cli.skipSettings,
			filterTestAccounts: cli.filterTestAccounts,
			verbose: cli.verbose,
			ingest: (batch) => ingest(`${POSTHOG_API_HOST}/batch/`, projectToken ?? "", batch),
		},
	})

	log(cli.dryRun ? "\nDry run complete: nothing was written." : "\nDone.")
	if (!cli.dryRun)
		for (const spec of selected) {
			const dashboard = result.resolved.get(spec.slug)
			if (dashboard)
				log(
					`  ${dashboardName(dashboards, spec)}: ${POSTHOG_UI_HOST}/project/${cli.projectId}/dashboard/${dashboard.id}`
				)
		}
	if (result.failedSteps.length) log(`Failed steps: ${result.failedSteps.join(", ")}`)
	if (result.failedQueries.length) log(`Failed queries: ${result.failedQueries.join(", ")}`)
	if (result.failedSteps.length || result.failedQueries.length || errors.length)
		process.exitCode = 1
}

main().catch((error: unknown) => {
	process.stderr.write(`\nFailed: ${error instanceof Error ? error.message : String(error)}\n`)
	process.exit(1)
})
