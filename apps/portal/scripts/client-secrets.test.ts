// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { clientLeaks } from "./client-secrets.ts"

const SECRET = "00000000-test-4000-8000-000000000000"

const sourceFiles = (dir: URL) =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && /\.(ts|tsx)$/.test(entry.name))
		.map((entry) => `${entry.parentPath}/${entry.name}`)

const portalSources = sourceFiles(new URL("../src", import.meta.url))
const relative = (path: string) => path.slice(path.indexOf("/src/") + 1)

describe("clientLeaks", () => {
	it("passes a client build without server-only values", () => {
		expect(
			clientLeaks([{ path: "assets/index.js", content: 'fetch("/_serverFn/abc")' }], [SECRET])
		).toEqual([])
	})

	it("names every file that holds the key name, the key header, the tda origin or the key value", () => {
		expect(
			clientLeaks(
				[
					{ path: "a.js", content: "env.TDA_API_KEY" },
					{ path: "b.js", content: '{"X-API-Key":k}' },
					{ path: "c.js", content: 'fetch("https://tda.talisman.xyz/pools")' },
					{ path: "d.js", content: `const k="${SECRET}"` },
				],
				[SECRET]
			)
		).toEqual([
			"a.js: TDA_API_KEY",
			"b.js: X-API-Key",
			"c.js: https://tda.talisman.xyz",
			"d.js: the TDA_API_KEY value",
		])
	})
})

describe("server-only code", () => {
	it("reads TDA_API_KEY only in the tda server functions", () => {
		expect(
			portalSources
				.filter((path) => readFileSync(path, "utf8").includes("TDA_API_KEY"))
				.map(relative)
				.sort()
		).toEqual(["src/domains/staking/subtensor/tda.functions.ts", "src/worker-env.d.ts"])
	})

	it("imports the Worker env only in the Worker entry and the tda server functions", () => {
		expect(
			portalSources
				.filter((path) => /from "cloudflare:workers"/.test(readFileSync(path, "utf8")))
				.map(relative)
				.sort()
		).toEqual(["src/domains/staking/subtensor/tda.functions.ts", "src/server.ts"])
	})
})
