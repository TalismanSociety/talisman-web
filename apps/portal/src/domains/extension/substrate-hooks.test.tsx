import { Subscribe } from "@react-rxjs/core"
import { render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, fakeWallet, load } from "./fakeInjectedWeb3"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

describe("substrate wallet hooks", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => localStorage.clear())

	afterEach(() => {
		harness.dispose()
		vi.unstubAllGlobals()
	})

	it("renders the connected wallet on the first render of a consumer that mounts after the last one left, with only the lifecycle subscribed", async () => {
		harness = await load({ talisman: fakeWallet([alice]) })
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

	it("reports the wallet lifecycle as initialised once the stored wallet is connected", async () => {
		harness = await load({ talisman: fakeWallet([alice]) })
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
