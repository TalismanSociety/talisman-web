#!/usr/bin/env node
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, rmSync } from "node:fs"
import { join } from "node:path"
import { createInterface } from "node:readline"
import { fail } from "./lib.mjs"
import { envFile, tdaKey } from "./tda-key.mjs"

const [src] = process.argv.slice(2)
const dir = join(src, "apps/portal/dist")
const key = tdaKey()
if (!key) fail(`no TDA_API_KEY in the environment or in ${envFile()}`)

if (existsSync(join(dir, "server/.dev.vars")))
	fail(`${dir}/server/.dev.vars would replace the key and holds local secrets: rebuild without it`)

const scratch = mkdtempSync("/tmp/worker-")
const wrangler = spawn(
	process.execPath,
	[
		"--no-warnings",
		join(src, "node_modules/wrangler/wrangler-dist/cli.js"),
		"dev",
		"--config",
		join(dir, "server/wrangler.json"),
		"--ip",
		"localhost",
		"--port",
		"3002",
		"--inspector-port",
		"0",
		"--persist-to",
		join(scratch, "state"),
		"--show-interactive-dev-session=false",
	],
	{
		env: {
			PATH: process.env.PATH,
			HOME: process.env.HOME,
			TDA_API_KEY: key,
			CLOUDFLARE_INCLUDE_PROCESS_ENV: "true",
			WRANGLER_SEND_METRICS: "false",
			WRANGLER_LOG_PATH: join(scratch, "logs"),
		},
		stdio: ["ignore", "pipe", "pipe"],
	}
)

for (const [from, to] of [
	[wrangler.stdout, process.stdout],
	[wrangler.stderr, process.stderr],
])
	createInterface({ input: from, crlfDelay: Infinity }).on("line", (line) =>
		to.write(`${line.replaceAll(key, "<TDA_API_KEY>")}\n`)
	)

process.on("SIGTERM", () => wrangler.kill("SIGTERM"))
process.on("SIGINT", () => wrangler.kill("SIGINT"))
wrangler.on("exit", (code, signal) => {
	rmSync(scratch, { recursive: true, force: true })
	process.exit(code ?? (signal ? 1 : 0))
})
