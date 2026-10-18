import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, fakeExtension, load } from "./fakeInjectedWeb3"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

describe("a wallet that injects late", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => {
		localStorage.clear()
		vi.useFakeTimers()
	})

	afterEach(() => {
		harness.dispose()
		vi.useRealTimers()
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
		Reflect.deleteProperty(globalThis, "injectedWeb3")
	})

	const loadThenInject = async ({
		pageLoadMs,
		injectMs,
	}: {
		pageLoadMs: number
		injectMs: number
	}) => {
		const readyState = vi
			.spyOn(document, "readyState", "get")
			.mockReturnValue(pageLoadMs === 0 ? "complete" : "interactive")
		harness = await load()
		if (pageLoadMs > 0) {
			await vi.advanceTimersByTimeAsync(pageLoadMs)
			readyState.mockReturnValue("complete")
			window.dispatchEvent(new Event("load"))
		}
		await vi.advanceTimersByTimeAsync(injectMs - pageLoadMs)
		fakeExtension("talisman", [alice])
		await vi.advanceTimersByTimeAsync(3_000)
	}

	it("reconnects a stored wallet that injects 200 ms after a page load 1.5 s after the subscribe", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		await loadThenInject({ pageLoadMs: 1_500, injectMs: 1_700 })

		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})
})
