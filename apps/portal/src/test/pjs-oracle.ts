import { readFileSync } from "node:fs"
import { gunzipSync } from "node:zlib"

export const oracleKey = (parts: unknown[]) =>
	JSON.stringify(parts, (_, value) => (typeof value === "bigint" ? `${value}n` : value))

export const loadPjsOracle = (fixture: URL) => {
	const frozen = JSON.parse(gunzipSync(readFileSync(fixture)).toString("utf8")) as Record<
		string,
		string | null
	>
	return (...parts: unknown[]) => {
		const key = oracleKey(parts)
		if (!(key in frozen)) throw new Error(`No frozen polkadot.js output for ${key}`)
		return frozen[key] ?? undefined
	}
}
