// @vitest-environment node
import { readFileSync } from "node:fs"
import { expect, it } from "vitest"

const BANNED =
	/(@polkadot\/[\w.-]+|avail-js-sdk|@talismn\/react-polkadot-api|recoil|jotai|@recoiljs\/[\w.-]+)/g

it("keeps polkadot.js, recoil and jotai out of the dependency tree", () => {
	const lockfile = readFileSync(new URL("../../../pnpm-lock.yaml", import.meta.url), "utf8")
	expect(lockfile).toContain("polkadot-api@3.2.1")
	expect([...new Set(lockfile.match(BANNED))]).toEqual([])
})
