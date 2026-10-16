import { existsSync, readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { TDA_ORIGIN } from "../src/domains/staking/subtensor/tda-client.ts"

const SERVER_ONLY_MARKERS = ["TDA_API_KEY", "X-API-Key", TDA_ORIGIN]

type ClientFile = { path: string; content: string }

export const clientLeaks = (files: ClientFile[], secrets: string[]) =>
	files.flatMap(({ path, content }) => [
		...SERVER_ONLY_MARKERS.filter((marker) => content.includes(marker)).map(
			(marker) => `${path}: ${marker}`
		),
		...(secrets.some((secret) => content.includes(secret))
			? [`${path}: the TDA_API_KEY value`]
			: []),
	])

const filesUnder = (dir: URL): ClientFile[] =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => {
			const path = `${entry.parentPath}/${entry.name}`
			return { path, content: readFileSync(path, "latin1") }
		})

const localSecret = (envFile: URL) =>
	existsSync(envFile)
		? readFileSync(envFile, "utf8")
				.match(/^TDA_API_KEY=(.*)$/m)?.[1]
				?.trim()
				.replace(/^(["'])(.*)\1$/, "$2")
		: undefined

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const secrets = [process.env["TDA_API_KEY"], localSecret(new URL("../.env", import.meta.url))]
	const leaks = clientLeaks(
		filesUnder(new URL("../dist/client", import.meta.url)),
		secrets.filter((secret): secret is string => !!secret)
	)
	if (leaks.length) {
		console.error(`Server-only values in the client build:\n${leaks.join("\n")}`)
		process.exit(1)
	}
}
