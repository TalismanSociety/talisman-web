import { firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import polkadotJsWalletLogo from "@/assets/polkadot-js-wallet.svg"
import talismanWalletLogo from "@/assets/talisman-wallet.svg"
import { alice, bob, evm, fakeWallet, load, refusingWallet, watched } from "./fakeInjectedWeb3"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

describe("substrate wallet connection", () => {
	let harness: Awaited<ReturnType<typeof load>>

	beforeEach(() => {
		localStorage.clear()
		toast.error.mockClear()
		capture.mockClear()
	})

	afterEach(() => {
		harness.dispose()
		vi.unstubAllGlobals()
	})

	it("reconnects the wallet stored by main under connected-substrate-extension", async () => {
		localStorage.setItem("connected-substrate-extension", '"polkadot-js"')
		const polkadotJs = fakeWallet([bob])
		harness = await load({ talisman: fakeWallet([alice]), "polkadot-js": polkadotJs })

		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(polkadotJs.enable).toHaveBeenCalledWith("Talisman")
		expect(harness.connected()?.id).toBe("polkadot-js")
		expect(harness.connected()?.signer).toBe(polkadotJs.signer)
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')
		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
	})

	it("auto-connects Talisman on a fresh profile and stores the id JSON-encoded", async () => {
		const talisman = fakeWallet([alice, evm])
		harness = await load({ "polkadot-js": fakeWallet([bob]), talisman })

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([
				["Guardians SUB", alice.address, "sr25519"],
				["Guardians EVM", evm.address, "ethereum"],
			])
		)
		expect(talisman.enable).toHaveBeenCalledWith("Talisman")
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
		expect(capture).toHaveBeenCalledWith("Substrate extensions connected", { wallet: "talisman" })
	})

	it("connects nothing on a fresh profile without Talisman", async () => {
		const polkadotJs = fakeWallet([bob])
		harness = await load({ "polkadot-js": polkadotJs })

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(polkadotJs.enable).not.toHaveBeenCalled()
		expect(harness.accounts()).toEqual([])
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})

	it("initialises without any wallet installed", async () => {
		harness = await load(undefined)

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(harness.wallets()).toEqual([])
	})

	it("lists installed wallets with the portal's titles and logos, in injection order", async () => {
		harness = await load({
			"polkadot-js": fakeWallet([]),
			talisman: fakeWallet([alice]),
			subwallet: fakeWallet([]),
		})

		await vi.waitFor(() => expect(harness.wallets()).toHaveLength(3))
		expect(harness.wallets().map(({ id, title }) => [id, title])).toEqual([
			["polkadot-js", "Polkadot.js"],
			["talisman", "Talisman"],
			["subwallet", "subwallet"],
		])
		expect(harness.wallets().map((wallet) => wallet.iconUrl)).toEqual([
			polkadotJsWalletLogo,
			talismanWalletLogo,
			undefined,
		])
	})

	it("keeps the wallet's watched accounts marked readonly", async () => {
		harness = await load({ talisman: fakeWallet([alice, watched]) })

		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))
		const [signable, watchedAccount] = await firstValueFrom(harness.injectedAccounts$)
		expect(signable).toEqual({
			address: alice.address,
			name: "Guardians SUB",
			type: "sr25519",
			genesisHash: undefined,
			origin: "injected",
		})
		expect(watchedAccount).toMatchObject({ readonly: true, partOfPortfolio: false })
	})

	it("switches wallets on connect and clears the key on disconnect", async () => {
		const talisman = fakeWallet([alice])
		const polkadotJs = fakeWallet([bob])
		harness = await load({ talisman, "polkadot-js": polkadotJs })
		await vi.waitFor(() => expect(harness.connected()?.id).toBe("talisman"))

		harness.connectSubstrateWallet({ id: "polkadot-js", title: "Polkadot.js" })
		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')

		harness.disconnectSubstrateWallet()
		await vi.waitFor(() => expect(harness.accounts()).toEqual([]))
		expect(harness.connected()).toBeUndefined()
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})

	it("forgets a wallet whose connection the user declined and says so", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		harness = await load({ talisman: refusingWallet() })

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(toast.error).toHaveBeenCalledWith("Wallet connection declined")
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
		expect(harness.accounts()).toEqual([])
	})

	it("drops an account the wallet removes", async () => {
		const talisman = fakeWallet([alice, bob])
		harness = await load({ talisman })
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))

		talisman.publish([alice])

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		)
	})

	it("hands out the papi tx creator of a connected account", async () => {
		harness = await load({ talisman: fakeWallet([alice]) })
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(1))

		expect(await harness.txCreatorOf(alice.address)).toEqual(expect.any(Function))
		expect(await harness.txCreatorOf(bob.address)).toBeUndefined()
	})
})
