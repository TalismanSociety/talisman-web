import { firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import polkadotJsWalletLogo from "@/assets/polkadot-js-wallet.svg"
import talismanWalletLogo from "@/assets/talisman-wallet.svg"
import { alice, bob, evm, fakeExtension, load, watched } from "./fakeInjectedWeb3"

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
		vi.restoreAllMocks()
	})

	const injectBeforePageLoad = async () => {
		const readyState = vi.spyOn(document, "readyState", "get").mockReturnValue("interactive")
		harness = await load()
		await new Promise((resolve) => setTimeout(resolve, 1_300))
		fakeExtension("talisman", [alice])
		readyState.mockReturnValue("complete")
		window.dispatchEvent(new Event("load"))
	}

	it("reconnects the wallet stored by main under connected-substrate-extension", async () => {
		localStorage.setItem("connected-substrate-extension", '"polkadot-js"')
		fakeExtension("talisman", [alice])
		const polkadotJs = fakeExtension("polkadot-js", [bob])
		harness = await load()

		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(polkadotJs.enableCalls()).toEqual(["Talisman"])
		expect(harness.connected()?.id).toBe("polkadot-js")
		await harness.connected()?.signer.signRaw({ address: bob.address, data: "0x00", type: "bytes" })
		expect(polkadotJs.signRawCalls()).toEqual([
			{ address: bob.address, data: "0x00", type: "bytes" },
		])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')
		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
	})

	it("reports the wallets initialised only once the stored wallet shows connected with its accounts", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		fakeExtension("talisman", [alice, evm])
		harness = await load()
		const atInitialised: unknown[] = []
		const subscription = harness.initialisedSubstrateWallets$.subscribe((initialised) => {
			if (initialised) atInitialised.push([harness.connected()?.id, harness.accounts()])
		})

		await vi.waitFor(() => expect(atInitialised).toHaveLength(1), { timeout: 2_000 })
		subscription.unsubscribe()
		expect(atInitialised).toEqual([
			[
				"talisman",
				[
					["Guardians SUB", alice.address, "sr25519"],
					["Guardians EVM", evm.address, "ethereum"],
				],
			],
		])
	})

	const guardiansSub = {
		address: "5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP",
		name: "Guardians SUB",
		type: "sr25519",
	} as const
	const kheopskitStoreFromMain = JSON.stringify({
		cachedWallets: [
			{
				id: "polkadot:talisman",
				platform: "polkadot",
				type: "injected",
				name: "Talisman",
				isConnected: true,
			},
		],
		cachedAccounts: [
			{
				id: `polkadot:talisman::${guardiansSub.address}`,
				platform: "polkadot",
				address: guardiansSub.address,
				name: "Guardians SUB",
				polkadotAccountType: "sr25519",
				walletId: "polkadot:talisman",
				walletName: "Talisman",
			},
		],
		autoReconnect: ["polkadot:talisman"],
	})

	it.each([
		["prod's keys and no kheopskit store", undefined],
		["main's keys and kheopskit 5's store", kheopskitStoreFromMain],
	])("reconnects from %s", async (_, kheopskitStore) => {
		if (kheopskitStore) localStorage.setItem("kheopskit", kheopskitStore)
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		localStorage.setItem(
			"readonly_accounts",
			`[{"address":"${alice.address}","name":"Watched Alice"}]`
		)
		const talisman = fakeExtension("talisman", [guardiansSub])
		harness = await load()
		const readonly: string[] = []
		const subscription = harness.readonlyAccounts$.subscribe((accounts) => {
			readonly.splice(0, readonly.length, ...accounts.map((account) => account.name ?? ""))
		})

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", guardiansSub.address, "sr25519"]])
		)
		subscription.unsubscribe()
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(readonly).toEqual(["Watched Alice"])
		await vi.waitFor(
			() =>
				expect(JSON.parse(localStorage.getItem("kheopskit") ?? "{}")).toMatchObject({
					remembered: ["polkadot:talisman"],
					cachedAccounts: [expect.objectContaining({ address: guardiansSub.address })],
				}),
			{ timeout: 3_000 }
		)
		expect(JSON.parse(localStorage.getItem("kheopskit") ?? "{}")).not.toHaveProperty(
			"autoReconnect"
		)
	})

	it("auto-connects Talisman on a fresh profile and stores the id JSON-encoded", async () => {
		fakeExtension("polkadot-js", [bob])
		const talisman = fakeExtension("talisman", [alice, evm])
		harness = await load()

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([
				["Guardians SUB", alice.address, "sr25519"],
				["Guardians EVM", evm.address, "ethereum"],
			])
		)
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
		expect(capture.mock.calls).toEqual([["Substrate extensions connected", { wallet: "talisman" }]])
	})

	it("reconnects a stored wallet that injects late, before the page load", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		await injectBeforePageLoad()

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		)
		expect(harness.initialised()).toBe(true)
	})

	it("auto-connects Talisman when it injects late, before the page load", async () => {
		await injectBeforePageLoad()

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		)
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"talisman"')
	})

	it("connects nothing on a fresh profile without Talisman", async () => {
		const polkadotJs = fakeExtension("polkadot-js", [bob])
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(polkadotJs.enableCalls()).toEqual([])
		expect(harness.accounts()).toEqual([])
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})

	it("initialises without any wallet installed", async () => {
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(harness.wallets()).toEqual([])
	})

	it("lists installed wallets with the portal's titles and logos, in injection order", async () => {
		fakeExtension("polkadot-js")
		fakeExtension("talisman", [alice])
		fakeExtension("subwallet")
		harness = await load()

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
		fakeExtension("talisman", [alice, watched])
		harness = await load()

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
		fakeExtension("talisman", [alice])
		fakeExtension("polkadot-js", [bob])
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()?.id).toBe("talisman"))

		harness.connectSubstrateWallet({ id: "polkadot-js", title: "Polkadot.js" })
		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')

		harness.disconnectSubstrateWallet()
		await vi.waitFor(() => expect(harness.accounts()).toEqual([]))
		expect(harness.connected()).toBeUndefined()
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
	})

	it("connects only the wallet the user switches to while the previous prompt is open", async () => {
		const talisman = fakeExtension("talisman", [alice], "hold")
		fakeExtension("polkadot-js", [bob])
		harness = await load()
		await vi.waitFor(() => expect(talisman.enableCalls()).toEqual(["Talisman"]))

		await harness.connectSubstrateWallet({ id: "polkadot-js", title: "Polkadot.js" })
		talisman.resolveEnable()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(harness.connected()?.id).toBe("polkadot-js")
		expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBe('"polkadot-js"')
		expect(toast.error).not.toHaveBeenCalled()
	})

	it("connects nothing when the user disconnects while the prompt is open", async () => {
		const talisman = fakeExtension("talisman", [alice], "hold")
		harness = await load()
		await vi.waitFor(() => expect(talisman.enableCalls()).toEqual(["Talisman"]))

		await harness.disconnectSubstrateWallet()
		talisman.resolveEnable()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(harness.connected()).toBeUndefined()
		expect(harness.accounts()).toEqual([])
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
		expect(toast.error).not.toHaveBeenCalled()
	})

	it("forgets a wallet whose connection the user declined and says so", async () => {
		localStorage.setItem("connected-substrate-extension", '"talisman"')
		const talisman = fakeExtension("talisman", [], "reject")
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(toast.error.mock.calls).toEqual([["Wallet connection declined"]])
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
		expect(harness.accounts()).toEqual([])
	})

	it("asks and warns once when the lifecycle is subscribed again before the wallets settle", async () => {
		const talisman = fakeExtension("talisman", [], "reject")
		harness = await load()
		harness.substrateWalletLifecycle$.subscribe().unsubscribe()
		const remount = harness.substrateWalletLifecycle$.subscribe()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		remount.unsubscribe()
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(toast.error.mock.calls).toEqual([["Wallet connection declined"]])
	})

	it("drops an account the wallet removes", async () => {
		const talisman = fakeExtension("talisman", [alice, bob])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))

		talisman.setAccounts([alice])

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		)
	})

	it("hands out the papi tx creator of a connected account", async () => {
		fakeExtension("talisman", [alice])
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(1))

		expect(await harness.txCreatorOf(alice.address)).toEqual(expect.any(Function))
		expect(await harness.txCreatorOf(bob.address)).toBeUndefined()
	})
})
