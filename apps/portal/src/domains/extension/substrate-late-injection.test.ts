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
	let talisman: ReturnType<typeof fakeExtension> | undefined
	let enabledAtInitialised: string[][]

	beforeEach(() => {
		localStorage.clear()
		vi.useFakeTimers()
		talisman = undefined
		enabledAtInitialised = []
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
		harness.initialisedSubstrateWallets$.subscribe((initialised) => {
			if (initialised) enabledAtInitialised.push(talisman?.enableCalls() ?? [])
		})
		if (pageLoadMs > 0) {
			await vi.advanceTimersByTimeAsync(pageLoadMs)
			readyState.mockReturnValue("complete")
			window.dispatchEvent(new Event("load"))
		}
		await vi.advanceTimersByTimeAsync(injectMs - pageLoadMs)
		talisman = fakeExtension("talisman", [alice])
		await vi.advanceTimersByTimeAsync(3_000)
	}

	it("auto-connects Talisman on a fresh profile when it injects 50 ms after the page load", async () => {
		await loadThenInject({ pageLoadMs: 1_500, injectMs: 1_550 })

		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})

	it("reports the wallets initialised only after the stored wallet that injects 50 ms after the page load is asked to connect", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		await loadThenInject({ pageLoadMs: 1_500, injectMs: 1_550 })

		expect(enabledAtInitialised).toEqual([["Talisman"]])
		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
	})

	it("auto-connects Talisman before reporting the wallets initialised when it injects just before kheopskit's last read, 1.1 s after the page load", async () => {
		await loadThenInject({ pageLoadMs: 1_500, injectMs: 2_550 })

		expect(enabledAtInitialised).toEqual([["Talisman"]])
		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})

	it("reconnects a stored wallet that injects 200 ms after a page load 1.5 s after the subscribe", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		await loadThenInject({ pageLoadMs: 1_500, injectMs: 1_700 })

		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})

	it("auto-connects Talisman when it injects 50 ms after a subscribe on an already loaded page", async () => {
		await loadThenInject({ pageLoadMs: 0, injectMs: 50 })

		expect(enabledAtInitialised).toEqual([["Talisman"]])
		expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})
})
