import { createFakePolkadotExtension } from "@kheopskit/core/testing"
import { Subscribe } from "@react-rxjs/core"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, load } from "./substrate.fixtures"

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

	it("renders the wallet connection on the first render of a consumer that mounts after the last one left, with only the lifecycle subscribed", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
		harness.dispose()
		const lifecycle = harness.substrateWalletLifecycle$.subscribe()
		const renders: boolean[] = []
		const ConnectedWallet = () => {
			renders.push(harness.useHasConnectedSubstrateWallet())
			return null
		}

		const first = render(
			<Subscribe>
				<ConnectedWallet />
			</Subscribe>
		)
		await vi.waitFor(() => expect(renders.at(-1)).toBe(true))
		first.unmount()
		renders.length = 0
		render(
			<Subscribe>
				<ConnectedWallet />
			</Subscribe>
		)

		expect(renders).toEqual([true])
		lifecycle.unsubscribe()
	})

	it("keeps the last accounts and wallet, and the retained lists, when the wallet bridge errors", async () => {
		bridge.failAfterAccounts = true
		vi.spyOn(console, "error").mockImplementation(() => undefined)
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		harness = await load()
		const { AccountWatcher } = await import("@/domains/accounts/AccountWatcher")
		render(<AccountWatcher />)
		const renders: Array<[boolean, string[]]> = []
		const Wallet = () => {
			renders.push([
				harness.useHasConnectedSubstrateWallet(),
				harness.useSelectedAccounts().map((account) => account.name ?? ""),
			])
			return null
		}
		const first = render(
			<Subscribe>
				<Wallet />
			</Subscribe>
		)

		await vi.waitFor(() => expect(renders.at(-1)).toEqual([true, ["Guardians SUB"]]))
		await vi.waitFor(() => expect(console.error).toHaveBeenCalled())
		first.unmount()
		renders.length = 0
		render(
			<Subscribe>
				<Wallet />
			</Subscribe>
		)

		expect(renders).toEqual([[true, ["Guardians SUB"]]])
		bridge.failAfterAccounts = false
	})

	it("reports the wallet lifecycle as initialised once the stored wallet is connected", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
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
