import { Subscribe } from "@react-rxjs/core"
import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const STORAGE_KEY = "analytics-consent"

const wrapper = ({ children }: { children: ReactNode }) => <Subscribe>{children}</Subscribe>

beforeEach(() => {
	vi.resetModules()
	localStorage.clear()
})

describe("analytics consent", () => {
	it("starts undecided and persists nothing", async () => {
		const { useConsent } = await import("./consent")
		const { result } = renderHook(() => useConsent(), { wrapper })

		expect(result.current).toBeNull()
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
	})

	it.each([
		["acceptAll", { analytics: true, errors: true }],
		["rejectAll", { analytics: false, errors: false }],
	] as const)("%s sets and persists both kinds", async (action, expected) => {
		const consent = await import("./consent")
		const { result } = renderHook(() => consent.useConsent(), { wrapper })

		act(() => consent[action]())

		expect(result.current).toEqual(expected)
		expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(expected))
	})

	it("sets each kind on its own", async () => {
		const { setConsent, useConsent } = await import("./consent")
		const { result } = renderHook(() => useConsent(), { wrapper })

		act(() => setConsent({ analytics: false, errors: true }))

		expect(result.current).toEqual({ analytics: false, errors: true })
	})

	it("restores the persisted choice", async () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: true, errors: false }))
		const { useConsent } = await import("./consent")
		const { result } = renderHook(() => useConsent(), { wrapper })

		expect(result.current).toEqual({ analytics: true, errors: false })
	})

	it.each([
		["unreadable JSON", "{not json"],
		["a value of another shape", JSON.stringify({ analytics: "yes", errors: true })],
		["a bare boolean", "true"],
	])("treats %s as undecided", async (_, stored) => {
		localStorage.setItem(STORAGE_KEY, stored)
		const { currentConsent } = await import("./consent")

		expect(currentConsent()).toBeNull()
	})

	it("keeps only the two kinds of a stored choice", async () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ analytics: true, errors: false, address: "5GrwvaEF" })
		)
		const { currentConsent } = await import("./consent")

		expect(currentConsent()).toEqual({ analytics: true, errors: false })
	})
})

const REJECTED = JSON.stringify({ analytics: false, errors: false })
const ACCEPTED = JSON.stringify({ analytics: true, errors: true })

const notifyStorageEvent = (init: StorageEventInit) =>
	act(() => {
		window.dispatchEvent(new StorageEvent("storage", { storageArea: localStorage, ...init }))
	})

const writeInOtherTab = (newValue: string | null) => {
	if (newValue === null) localStorage.removeItem(STORAGE_KEY)
	else localStorage.setItem(STORAGE_KEY, newValue)
	notifyStorageEvent({ key: STORAGE_KEY, newValue })
}

describe("analytics consent changed in another tab", () => {
	it("follows the other tab's choice, synchronously", async () => {
		const { acceptAll, currentConsent, useConsent } = await import("./consent")
		const { result } = renderHook(() => useConsent(), { wrapper })
		act(() => acceptAll())

		writeInOtherTab(REJECTED)

		expect(currentConsent()).toEqual({ analytics: false, errors: false })
		expect(result.current).toEqual({ analytics: false, errors: false })
	})

	it.each([
		["removes the choice", () => writeInOtherTab(null)],
		["writes unreadable JSON", () => writeInOtherTab("{not json")],
		[
			"clears the storage",
			() => {
				localStorage.clear()
				notifyStorageEvent({ key: null, newValue: null })
			},
		],
	])("becomes undecided when the other tab %s", async (_, change) => {
		const { acceptAll, currentConsent } = await import("./consent")
		acceptAll()

		change()

		expect(currentConsent()).toBeNull()
	})

	it("applies the stored choice, not the event's, so a late event cannot undo a newer choice", async () => {
		const { currentConsent } = await import("./consent")

		localStorage.setItem(STORAGE_KEY, ACCEPTED)
		notifyStorageEvent({ key: STORAGE_KEY, newValue: REJECTED })

		expect(currentConsent()).toEqual({ analytics: true, errors: true })
		expect(localStorage.getItem(STORAGE_KEY)).toBe(ACCEPTED)
	})

	it("ignores other keys and other storage areas", async () => {
		const { acceptAll, currentConsent } = await import("./consent")
		acceptAll()

		notifyStorageEvent({ key: "selected-currency", newValue: REJECTED })
		notifyStorageEvent({ key: STORAGE_KEY, newValue: REJECTED, storageArea: sessionStorage })
		notifyStorageEvent({ key: null, newValue: null, storageArea: sessionStorage })

		expect(currentConsent()).toEqual({ analytics: true, errors: true })
	})
})
