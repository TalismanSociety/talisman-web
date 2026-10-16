import { beforeEach, describe, expect, it, vi } from "vitest"

const domainModules = import.meta.glob(["./**/*.{ts,tsx}", "!./**/*.test.{ts,tsx}", "!./**/*.d.ts"])

beforeEach(() => vi.resetModules())

const IMPORT_TIMEOUT_MS = 30_000

describe("domain modules", () => {
	it.each(Object.keys(domainModules))(
		"%s loads when imported first",
		async (path) => {
			await expect(domainModules[path]?.()).resolves.toBeDefined()
		},
		IMPORT_TIMEOUT_MS
	)
})
