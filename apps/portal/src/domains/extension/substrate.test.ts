import { createKheopskitStore } from "@kheopskit/core"
import {
	cachedAccountOf,
	cachedWalletOf,
	createFakePolkadotExtension,
} from "@kheopskit/core/testing"
import { firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, bob, evm, load, remember, watched } from "./substrate.fixtures"

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
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		readyState.mockReturnValue("complete")
		window.dispatchEvent(new Event("load"))
	}

	it("moves the wallet stored by prod under connected-substrate-extension into kheopskit", async () => {
		localStorage.setItem("connected-substrate-extension", '"polkadot-js"')
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()

		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(polkadotJs.enableCalls()).toEqual(["Talisman"])
		expect(harness.connected()).toEqual(["polkadot:polkadot-js"])
		await (await harness.pjsSignerOf(bob.address))?.signRaw({
			address: bob.address,
			data: "0x00",
			type: "bytes",
		})
		expect(polkadotJs.signRawCalls()).toEqual([
			{ address: bob.address, data: "0x00", type: "bytes" },
		])
		expect(localStorage.getItem("connected-substrate-extension")).toBeNull()
		expect(harness.remembered()).toEqual(["polkadot:polkadot-js"])
		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
	})

	it("reports the wallets initialised only once the stored wallet shows connected with its accounts", async () => {
		remember("polkadot:talisman")
		createFakePolkadotExtension({ name: "talisman", accounts: [alice, evm] })
		harness = await load()
		const atInitialised: unknown[] = []
		const subscription = harness.initialisedSubstrateWallets$.subscribe((initialised) => {
			if (initialised) atInitialised.push([harness.connected(), harness.accounts()])
		})

		await vi.waitFor(() => expect(atInitialised).toHaveLength(1), { timeout: 2_000 })
		subscription.unsubscribe()
		expect(atInitialised).toEqual([
			[
				["polkadot:talisman"],
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
		const talisman = createFakePolkadotExtension({ name: "talisman", accounts: [guardiansSub] })
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

	it("reports the wallets initialised with the previous visit's accounts while the wallet reconnects", async () => {
		const seed = createKheopskitStore()
		const wallet = cachedWalletOf("polkadot:talisman", "Talisman")
		seed.rememberWallet(wallet.id)
		seed.setCachedState([wallet], [cachedAccountOf(wallet, alice.address, alice.name)])
		seed.destroy()
		const talisman = createFakePolkadotExtension({
			name: "talisman",
			accounts: [alice],
			enable: "hold",
		})
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true))
		expect(harness.accounts().map(([name, address]) => [name, address])).toEqual([
			["Guardians SUB", alice.address],
		])
		expect(harness.connected()).toEqual([])
		expect(await firstValueFrom(harness.hasConnectedSubstrateWallet$)).toBe(true)
		talisman.resolveEnable()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
	})

	it("reports the wallets initialised with the previous visit's accounts before the wallet injects", async () => {
		const seed = createKheopskitStore()
		const wallet = cachedWalletOf("polkadot:talisman", "Talisman")
		seed.rememberWallet(wallet.id)
		seed.setCachedState([wallet], [cachedAccountOf(wallet, alice.address, alice.name)])
		seed.destroy()
		harness = await load()

		await new Promise((resolve) => setTimeout(resolve, 200))
		expect(harness.initialised()).toBe(true)
		expect(harness.accounts().map(([name, address]) => [name, address])).toEqual([
			["Guardians SUB", alice.address],
		])
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
	})

	it("auto-connects Talisman on a fresh profile and stores the id JSON-encoded", async () => {
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		const talisman = createFakePolkadotExtension({ name: "talisman", accounts: [alice, evm] })
		harness = await load()

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([
				["Guardians SUB", alice.address, "sr25519"],
				["Guardians EVM", evm.address, "ethereum"],
			])
		)
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(harness.remembered()).toEqual(["polkadot:talisman"])
		expect(capture.mock.calls).toEqual([["Substrate extensions connected", { wallet: "talisman" }]])
	})

	it("reconnects a stored wallet that injects late, before the page load", async () => {
		remember("polkadot:talisman")
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
		expect(harness.remembered()).toEqual(["polkadot:talisman"])
	})

	it("connects nothing on a fresh profile without Talisman", async () => {
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(polkadotJs.enableCalls()).toEqual([])
		expect(harness.accounts()).toEqual([])
		expect(harness.remembered()).toEqual([])
	})

	it("initialises without any wallet installed", async () => {
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(harness.wallets()).toEqual([])
	})

	it("lists installed wallets as kheopskit names and orders them, Talisman first", async () => {
		createFakePolkadotExtension({ name: "polkadot-js" })
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		createFakePolkadotExtension({ name: "subwallet" })
		harness = await load()

		await vi.waitFor(() => expect(harness.wallets()).toHaveLength(3))
		expect(harness.wallets().map(({ id, name }) => [id, name])).toEqual([
			["polkadot:talisman", "Talisman"],
			["polkadot:polkadot-js", "Polkadot.js"],
			["polkadot:subwallet", "subwallet"],
		])
		expect(harness.wallets().map((wallet) => wallet.icon.startsWith("data:image/svg+xml"))).toEqual(
			[true, true, false]
		)
	})

	it("keeps the wallet's watched accounts marked readonly", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice, watched] })
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

	it("keeps every wallet the user connects and forgets only the one they disconnect", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))

		await harness.wallet("polkadot:polkadot-js").connect()
		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([
				["Guardians SUB", alice.address, "sr25519"],
				["Bob", bob.address, "sr25519"],
			])
		)
		expect(harness.remembered()).toEqual(["polkadot:talisman", "polkadot:polkadot-js"])
		expect(capture.mock.calls).toEqual([
			["Substrate extensions connected", { wallet: "talisman" }],
			["Substrate extensions connected", { wallet: "polkadot-js" }],
		])

		await harness.wallet("polkadot:talisman").disconnect()
		await vi.waitFor(() => expect(harness.accounts()).toEqual([["Bob", bob.address, "sr25519"]]))
		expect(harness.connected()).toEqual(["polkadot:polkadot-js"])
		expect(harness.remembered()).toEqual(["polkadot:polkadot-js"])
	})

	it("reconnects every remembered wallet before reporting the wallets initialised", async () => {
		remember("polkadot:talisman")
		remember("polkadot:polkadot-js")
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		const polkadotJs = createFakePolkadotExtension({
			name: "polkadot-js",
			accounts: [bob],
			enable: "hold",
		})
		harness = await load()
		await vi.waitFor(() => expect(polkadotJs.enableCalls()).toEqual(["Talisman"]))
		await new Promise((resolve) => setTimeout(resolve, 700))
		expect(harness.initialised()).toBe(false)

		polkadotJs.resolveEnable()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true))
		expect(harness.connected()).toEqual(["polkadot:talisman", "polkadot:polkadot-js"])
	})

	it("waits for a remembered wallet that injects late before reporting the wallets initialised", async () => {
		remember("polkadot:talisman")
		remember("polkadot:polkadot-js")
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		harness = await load()
		const atInitialised: unknown[] = []
		const subscription = harness.initialisedSubstrateWallets$.subscribe((initialised) => {
			if (initialised) atInitialised.push(harness.connected())
		})

		await new Promise((resolve) => setTimeout(resolve, 300))
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })

		await vi.waitFor(() => expect(atInitialised).toHaveLength(1), { timeout: 2_000 })
		subscription.unsubscribe()
		expect(atInitialised).toEqual([["polkadot:talisman", "polkadot:polkadot-js"]])
	})

	it("signs each account through the wallet that lists it, and any other address through the first connected wallet", async () => {
		const talisman = createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
		await harness.wallet("polkadot:polkadot-js").connect()
		const signRaw = async (address: string) =>
			(await harness.pjsSignerOf(address))?.signRaw({ address, data: "0x00", type: "bytes" })

		await signRaw(bob.address)
		await signRaw(alice.address)
		await signRaw(watched.address)

		expect(polkadotJs.signRawCalls().map(({ address }) => address)).toEqual([bob.address])
		expect(talisman.signRawCalls().map(({ address }) => address)).toEqual([
			alice.address,
			watched.address,
		])
	})

	it("signs an address through the wallet that holds its key when another wallet only watches it", async () => {
		const talisman = createFakePolkadotExtension({
			name: "talisman",
			accounts: [{ ...alice, readonly: true, partOfPortfolio: false }],
		})
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [alice] })
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
		await harness.wallet("polkadot:polkadot-js").connect()

		expect(await firstValueFrom(harness.injectedAccounts$)).toEqual([
			expect.not.objectContaining({ readonly: true }),
		])
		await (await harness.pjsSignerOf(alice.address))?.signRaw({
			address: alice.address,
			data: "0x00",
			type: "bytes",
		})
		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
	})

	const reconnectingTalismanListing = (address: string, name: string) => {
		const seed = createKheopskitStore()
		const wallet = cachedWalletOf("polkadot:talisman", "Talisman")
		seed.rememberWallet(wallet.id)
		seed.setCachedState([wallet], [cachedAccountOf(wallet, address, name)])
		seed.destroy()
		return createFakePolkadotExtension({ name: "talisman", accounts: [alice], enable: "hold" })
	}

	it("signs through a connected wallet's listing while another wallet that lists the address reconnects", async () => {
		reconnectingTalismanListing(alice.address, alice.name)
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [alice] })
		harness = await load()
		await harness.wallet("polkadot:polkadot-js").connect()

		await (await harness.pjsSignerOf(alice.address))?.signRaw({
			address: alice.address,
			data: "0x00",
			type: "bytes",
		})
		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(await harness.txCreatorOf(alice.address)).toEqual(expect.any(Function))
	})

	it("waits for the reconnecting wallet that lists an address instead of handing it to another wallet", async () => {
		const talisman = reconnectingTalismanListing(alice.address, alice.name)
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await harness.wallet("polkadot:polkadot-js").connect()

		expect(await harness.pjsSignerOf(alice.address)).toBeUndefined()
		talisman.resolveEnable()
		await vi.waitFor(() =>
			expect(harness.connected()).toEqual(["polkadot:talisman", "polkadot:polkadot-js"])
		)
		await (await harness.pjsSignerOf(alice.address))?.signRaw({
			address: alice.address,
			data: "0x00",
			type: "bytes",
		})
		expect(talisman.signRawCalls()).toHaveLength(1)
	})

	it("connects nothing when the user disconnects while the prompt is open", async () => {
		const talisman = createFakePolkadotExtension({
			name: "talisman",
			accounts: [alice],
			enable: "hold",
		})
		harness = await load()
		await vi.waitFor(() => expect(talisman.enableCalls()).toEqual(["Talisman"]))

		await harness.wallet("polkadot:talisman").disconnect()
		talisman.resolveEnable()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(harness.connected()).toEqual([])
		expect(harness.accounts()).toEqual([])
		expect(harness.remembered()).toEqual([])
		expect(toast.error).not.toHaveBeenCalled()
	})

	it("has no signer without a connected wallet", async () => {
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(await harness.pjsSignerOf(bob.address)).toBeUndefined()
	})

	it("forgets a wallet whose connection the user declined and says so", async () => {
		remember("polkadot:talisman")
		const talisman = createFakePolkadotExtension({
			name: "talisman",
			accounts: [],
			enable: "reject",
		})
		harness = await load()

		await vi.waitFor(() => expect(harness.initialised()).toBe(true), { timeout: 2_000 })
		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(toast.error.mock.calls).toEqual([["Wallet connection declined"]])
		expect(harness.remembered()).toEqual([])
		expect(harness.accounts()).toEqual([])
	})

	it("asks and warns once when the lifecycle is subscribed again", async () => {
		const talisman = createFakePolkadotExtension({
			name: "talisman",
			accounts: [],
			enable: "reject",
		})
		harness = await load()
		await vi.waitFor(() => expect(toast.error).toHaveBeenCalled(), { timeout: 2_000 })

		harness.unmountLifecycle()
		const remount = harness.substrateWalletLifecycle$.subscribe()
		await new Promise((resolve) => setTimeout(resolve, 100))
		remount.unsubscribe()

		expect(talisman.enableCalls()).toEqual(["Talisman"])
		expect(toast.error.mock.calls).toEqual([["Wallet connection declined"]])
	})

	it("drops an account the wallet removes", async () => {
		const talisman = createFakePolkadotExtension({ name: "talisman", accounts: [alice, bob] })
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(2))

		talisman.setAccounts([alice])

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([["Guardians SUB", alice.address, "sr25519"]])
		)
	})

	it("hands out the papi tx creator of a connected account", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		harness = await load()
		await vi.waitFor(() => expect(harness.accounts()).toHaveLength(1))

		expect(await harness.txCreatorOf(alice.address)).toEqual(expect.any(Function))
		expect(await harness.txCreatorOf(bob.address)).toBeUndefined()
	})
})
