#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parseEnv } from "node:util"

const mainCheckout = () =>
	dirname(
		execFileSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
			encoding: "utf8",
		}).trim()
	)

export const envFile = () => join(mainCheckout(), "apps/portal/.env")

export const tdaKey = () => {
	if (process.env.TDA_API_KEY) return process.env.TDA_API_KEY
	const file = envFile()
	return existsSync(file) ? parseEnv(readFileSync(file, "utf8")).TDA_API_KEY || undefined : undefined
}

const filesUnder = (path) => {
	if (!existsSync(path)) return []
	if (!statSync(path).isDirectory()) return [path]
	return readdirSync(path, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => join(entry.parentPath, entry.name))
}

const commands = {
	check: () => {
		if (tdaKey()) return console.log("TDA_API_KEY: found")
		console.error(
			`no TDA_API_KEY in the environment or in ${envFile()}: the Worker's Bittensor server functions would fail on both sides, so the lane stops instead of comparing broken rows`
		)
		process.exit(1)
	},
	scan: (...paths) => {
		const key = tdaKey()
		if (!key) return console.log("key scan: no TDA_API_KEY, nothing to look for")
		const files = paths.flatMap(filesUnder)
		const leaks = files.filter((file) => readFileSync(file, "latin1").includes(key))
		console.log(`key scan: ${files.length} files, ${leaks.length} hold the TDA_API_KEY value`)
		for (const leak of leaks) console.error(`the TDA_API_KEY value is in ${leak}`)
		if (leaks.length) process.exit(1)
	},
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const [command, ...args] = process.argv.slice(2)
	if (!Object.hasOwn(commands, command)) {
		console.error("usage: tda-key.mjs check | scan <path>…")
		process.exit(2)
	}
	commands[command](...args)
}
