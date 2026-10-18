import { Subscribe } from "@react-rxjs/core"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, fakeExtension, load } from "./fakeInjectedWeb3"

const { toast, capture, bridge } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
	bridge: { failAfterAccounts: false },
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))
vi.mock("@kheopskit/core", async (importOriginal) => {
	const original = await importOriginal<typeof import("@kheopskit/core")>()
	const { concat, concatMap, of, switchMap, throwError, timer } = await import("rxjs")
	return {
		...original,
		getKheopskit$: (...args: Parameters<typeof original.getKheopskit$>) =>
			original
				.getKheopskit$(...args)
				.pipe(
					concatMap((state) =>
						bridge.failAfterAccounts && state.accounts.length > 0
							? concat(
									of(state),
									timer(50).pipe(switchMap(() => throwError(() => new Error("wallet bridge died"))))
								)
							: of(state)
					)
				),
	}
})

describe("substrate wallet hooks", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => localStorage.clear())

	afterEach(() => {
		harness.dispose()
	})

	it("renders the connected wallet on the first render of a consumer that mounts after the last one left, with only the lifecycle subscribed", async () => {
		fakeExtension("talisman", [alice])
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()?.id).toBe("talisman"))
		harness.dispose()
		const lifecycle = harness.substrateWalletLifecycle$.subscribe()
		const renders: Array<string | undefined> = []
		const ConnectedWallet = () => {
			renders.push(harness.useConnectedSubstrateWallet()?.id)
			return null
		}

		const first = render(
			<Subscribe>
				<ConnectedWallet />
			</Subscribe>
		)
		await vi.waitFor(() => expect(renders.at(-1)).toBe("talisman"))
		first.unmount()
		renders.length = 0
		render(
			<Subscribe>
				<ConnectedWallet />
			</Subscribe>
		)

		expect(renders).toEqual(["talisman"])
		lifecycle.unsubscribe()
	})

	it("keeps the last accounts and wallet, and the retained lists, when the wallet bridge errors", async () => {
		bridge.failAfterAccounts = true
		vi.spyOn(console, "error").mockImplementation(() => undefined)
		fakeExtension("talisman", [alice])
		harness = await load()
		const { AccountWatcher } = await import("@/domains/accounts/AccountWatcher")
		render(<AccountWatcher />)
		const renders: Array<[string | undefined, string[]]> = []
		const Wallet = () => {
			renders.push([
				harness.useConnectedSubstrateWallet()?.id,
				harness.useSelectedAccounts().map((account) => account.name ?? ""),
			])
			return null
		}
		const first = render(
			<Subscribe>
				<Wallet />
			</Subscribe>
		)

		await vi.waitFor(() => expect(renders.at(-1)).toEqual(["talisman", ["Guardians SUB"]]))
		await vi.waitFor(() => expect(console.error).toHaveBeenCalled())
		first.unmount()
		renders.length = 0
		render(
			<Subscribe>
				<Wallet />
			</Subscribe>
		)

		expect(renders).toEqual([["talisman", ["Guardians SUB"]]])
		bridge.failAfterAccounts = false
	})

	it("reports the wallet lifecycle as initialised once the stored wallet is connected", async () => {
		fakeExtension("talisman", [alice])
		harness = await load()
		const renders: boolean[] = []
		const Initialised = () => {
			renders.push(harness.useInitialisedSubstrateWallets())
			return null
		}

		render(
			<Subscribe>
				<Initialised />
			</Subscribe>
		)

		await vi.waitFor(() => expect(renders.at(-1)).toBe(true), { timeout: 2_000 })
		expect(renders[0]).toBe(false)
	})
})
