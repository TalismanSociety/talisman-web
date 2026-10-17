import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { persistedState } from "./persistedState"

const walletId = z.string()
const accounts = z.array(z.object({ address: z.string(), name: z.string().optional() }))

beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllGlobals())

describe("persistedState", () => {
	it("reads the wallet id main stored as a JSON string", () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')

		expect(persistedState("connected-substrate-extension", walletId, undefined).value).toBe(
			"talisman"
		)
	})

	it("reads the readonly accounts main stored, keeping only address and name", () => {
		localStorage.setItem(
			"readonly_accounts",
			JSON.stringify([
				{ address: "5Grw", name: "Alice", origin: "local", readonly: true },
				{ address: "0xd8dA" },
			])
		)

		expect(persistedState("readonly_accounts", accounts, []).value).toEqual([
			{ address: "5Grw", name: "Alice" },
			{ address: "0xd8dA" },
		])
	})

	it("falls back to the default on the literal undefined main wrote on disconnect", () => {
		localStorage.setItem("connected-substrate-extension", "undefined")

		expect(persistedState("connected-substrate-extension", walletId, undefined).value).toBe(
			undefined
		)
	})

	it("falls back to the default when the stored value has the wrong shape", () => {
		localStorage.setItem("readonly_accounts", JSON.stringify([{ name: "no address" }]))

		expect(persistedState("readonly_accounts", accounts, []).value).toEqual([])
	})

	it("writes changes JSON-encoded and restores them in a new session", () => {
		persistedState("connected-substrate-extension", walletId, undefined).next("polkadot-js")

		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')
		expect(persistedState("connected-substrate-extension", walletId, undefined).value).toBe(
			"polkadot-js"
		)
	})

	it("keeps a session-scoped key in sessionStorage with the same JSON format", () => {
		sessionStorage.setItem("EnableTestnets", "true")

		const state = persistedState("EnableTestnets", z.boolean(), false, "session")

		expect(state.value).toBe(true)
		state.next(false)
		expect(sessionStorage.getItem("EnableTestnets")).toBe("false")
		expect(localStorage.getItem("EnableTestnets")).toBeNull()
	})

	it("removes the entry when set to undefined", () => {
		const state = persistedState("connected-substrate-extension", walletId, undefined)
		state.next("talisman")
		state.next(undefined)

		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})

	it("holds the default and stores nothing where there is no storage", () => {
		vi.stubGlobal("localStorage", undefined)
		const state = persistedState("connected-substrate-extension", walletId, undefined)
		state.next("talisman")
		vi.unstubAllGlobals()

		expect(state.value).toBe("talisman")
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})
})
