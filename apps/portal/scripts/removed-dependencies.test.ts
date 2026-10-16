// @vitest-environment node
import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const lockfile = readFileSync(new URL("../../../pnpm-lock.yaml", import.meta.url), "utf8")

const REMOVED_PACKAGES = ["@sentry/"]

describe("removed dependencies", () => {
	it.each(REMOVED_PACKAGES)("resolves no %s package, directly or through another one", (name) => {
		expect(lockfile.split("\n").filter((line) => line.includes(name))).toEqual([])
	})
})
