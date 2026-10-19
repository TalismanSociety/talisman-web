import { createKheopskitStore, getWalletAccountId } from "@kheopskit/core"
import {
	cachedAccountOf,
	cachedWalletOf,
	createFakePolkadotExtension,
} from "@kheopskit/core/testing"
import { filter, firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Signer, WalletChoice } from "./signer"
import {
	alice,
	bob,
	evm,
	load,
	loadWithAliceInTwoWallets,
	remember,
	watched,
} from "./substrate.fixtures"

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
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	const signRaw = async (address: string, signer: Signer = { address }) =>
		(await harness.signingAccountFor(signer))?.pjsSigner?.signRaw({
			address,
			data: "0x00",
			type: "bytes",
		})

	const txCreatorOf = async (signer: Signer) =>
		(await harness.signingAccountFor(signer))?.account.txCreator

	const lookupOf = (signer: Signer) => {
		const lookup: { result: unknown } = { result: "pending" }
		void harness.signingAccountFor(signer).then((result) => {
			lookup.result = result
		})
		return lookup
	}

	const nextChoice = (after?: WalletChoice) =>
		firstValueFrom(
			harness.walletChoice$.pipe(
				filter((choice): choice is WalletChoice => choice !== undefined && choice !== after)
			)
		)

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
		await signRaw(bob.address)
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

	it("signs each account through the wallet that lists it, and no other address", async () => {
		const talisman = createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
		await harness.wallet("polkadot:polkadot-js").connect()

		await signRaw(bob.address)
		await signRaw(alice.address)

		expect(polkadotJs.signRawCalls().map(({ address }) => address)).toEqual([bob.address])
		expect(talisman.signRawCalls().map(({ address }) => address)).toEqual([alice.address])
		expect(await harness.signingAccountFor({ address: watched.address })).toBeUndefined()
	})

	it("has no signer for an address its wallet only watches", async () => {
		createFakePolkadotExtension({
			name: "talisman",
			accounts: [{ ...alice, readonly: true, partOfPortfolio: false }],
		})
		harness = await load()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))

		expect(await harness.signingAccountFor({ address: alice.address })).toBeUndefined()
		expect(
			await harness.signingAccountFor({
				address: alice.address,
				walletAccountId: getWalletAccountId("polkadot:talisman", alice.address),
			})
		).toBeUndefined()
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
		await signRaw(alice.address)
		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
	})

	const aliceInTwoWallets = async () => {
		const loaded = await loadWithAliceInTwoWallets()
		harness = loaded.harness
		return loaded
	}

	it("asks which wallet signs an address two wallets hold and signs only through the chosen one", async () => {
		const { talisman, polkadotJs } = await aliceInTwoWallets()

		const signed = signRaw(alice.address)
		const choice = await nextChoice()
		expect(choice.options.map(({ walletName, name }) => [walletName, name])).toEqual([
			["Talisman", "Guardians SUB"],
			["Polkadot.js", "Guardians SUB"],
		])
		choice.choose(choice.options[1])
		await signed

		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
		expect(await firstValueFrom(harness.walletChoice$)).toBeUndefined()
	})

	it("signs a picked pair through its own wallet without asking", async () => {
		const { talisman, polkadotJs } = await aliceInTwoWallets()
		const pairs = await firstValueFrom(harness.walletAccounts$)
		const picked = pairs.find(({ walletName }) => walletName === "Polkadot.js")

		await signRaw(alice.address, picked)

		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
	})

	it("cancels the signing when the user dismisses the wallet choice", async () => {
		const { talisman, polkadotJs } = await aliceInTwoWallets()

		const signed = signRaw(alice.address)
		;(await nextChoice()).choose(undefined)

		await expect(signed).rejects.toThrow("Cancelled")
		expect(await firstValueFrom(harness.walletChoice$)).toBeUndefined()
		expect(talisman.signRawCalls()).toEqual([])
		expect(polkadotJs.signRawCalls()).toEqual([])
	})

	it("cancels an unanswered wallet choice when another signing asks, and ignores its late answer", async () => {
		const { talisman, polkadotJs } = await aliceInTwoWallets()
		const first = harness.signingAccountFor({ address: alice.address })
		const firstChoice = await nextChoice()

		const second = harness.signingAccountFor({ address: alice.address })
		const secondChoice = await nextChoice(firstChoice)
		await expect(first).rejects.toThrow("Cancelled")
		firstChoice.choose(firstChoice.options[0])

		expect(await firstValueFrom(harness.walletChoice$)).toBe(secondChoice)
		secondChoice.choose(secondChoice.options[1])
		await (await second)?.pjsSigner?.signRaw({
			address: alice.address,
			data: "0x00",
			type: "bytes",
		})
		expect(polkadotJs.signRawCalls()).toHaveLength(1)
		expect(talisman.signRawCalls()).toEqual([])
	})

	const cacheTalismanListing = (address: string, name: string) => {
		const seed = createKheopskitStore()
		const wallet = cachedWalletOf("polkadot:talisman", "Talisman")
		seed.rememberWallet(wallet.id)
		seed.setCachedState([wallet], [cachedAccountOf(wallet, address, name)])
		seed.destroy()
	}

	const reconnectingTalismanListing = (address: string, name: string) => {
		cacheTalismanListing(address, name)
		return createFakePolkadotExtension({ name: "talisman", accounts: [alice], enable: "hold" })
	}

	it("asks which wallet signs while another wallet that lists the address reconnects, and waits for the reconnecting one when picked", async () => {
		const talisman = reconnectingTalismanListing(alice.address, alice.name)
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [alice] })
		harness = await load()
		await harness.wallet("polkadot:polkadot-js").connect()
		const settled: string[] = []
		const signed = signRaw(alice.address).finally(() => settled.push("signed"))

		const choice = await nextChoice()
		expect(choice.options.map(({ walletName }) => walletName)).toEqual(["Talisman", "Polkadot.js"])
		choice.choose(choice.options[0])
		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(settled).toEqual([])
		talisman.resolveEnable()

		await signed
		expect(talisman.signRawCalls()).toHaveLength(1)
		expect(polkadotJs.signRawCalls()).toEqual([])
	})

	it("waits for the reconnecting wallet that lists an address before handing out its signer", async () => {
		const talisman = reconnectingTalismanListing(alice.address, alice.name)
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await harness.wallet("polkadot:polkadot-js").connect()
		const settled: string[] = []
		const signed = signRaw(alice.address).finally(() => settled.push("signed"))
		const txCreator = txCreatorOf({ address: alice.address }).finally(() =>
			settled.push("txCreator")
		)

		await new Promise((resolve) => setTimeout(resolve, 100))
		expect(settled).toEqual([])
		talisman.resolveEnable()

		expect(await txCreator).toEqual(expect.any(Function))
		await signed
		expect(talisman.signRawCalls()).toHaveLength(1)
	})

	it("keeps waiting for a wallet that still reconnects after the cached accounts expire instead of handing its address to another wallet", async () => {
		vi.useFakeTimers()
		const talisman = reconnectingTalismanListing(alice.address, alice.name)
		const polkadotJs = createFakePolkadotExtension({ name: "polkadot-js", accounts: [bob] })
		harness = await load()
		await vi.advanceTimersByTimeAsync(1_000)
		const polkadotJsConnected = harness.wallet("polkadot:polkadot-js").connect()
		await vi.advanceTimersByTimeAsync(4_000)
		await polkadotJsConnected
		const settled: string[] = []
		const signed = signRaw(alice.address).finally(() => settled.push("signed"))

		await vi.advanceTimersByTimeAsync(1_000)
		expect(settled).toEqual([])
		talisman.resolveEnable()
		await vi.advanceTimersByTimeAsync(1_000)

		await signed
		expect(talisman.signRawCalls()).toHaveLength(1)
		expect(polkadotJs.signRawCalls()).toEqual([])
	})

	it("gives up on a picked wallet that does not reconnect before the deadline", async () => {
		vi.useFakeTimers()
		reconnectingTalismanListing(alice.address, alice.name)
		createFakePolkadotExtension({ name: "polkadot-js", accounts: [alice] })
		harness = await load()
		await vi.advanceTimersByTimeAsync(100)
		const polkadotJsConnected = harness.wallet("polkadot:polkadot-js").connect()
		await vi.advanceTimersByTimeAsync(1_000)
		await polkadotJsConnected
		const lookup = lookupOf({ address: alice.address })
		const choice = await nextChoice()
		choice.choose(choice.options.find(({ walletName }) => walletName === "Talisman"))

		await vi.advanceTimersByTimeAsync(9_000)
		expect(lookup.result).toBe("pending")
		await vi.advanceTimersByTimeAsync(1_000)
		expect(lookup.result).toBeUndefined()
	})

	it("gives up on signing when the wallet bridge stops while the wallet reconnects", async () => {
		vi.useFakeTimers()
		vi.spyOn(console, "error").mockImplementation(() => undefined)
		cacheTalismanListing(alice.address, alice.name)
		Reflect.set(globalThis, "injectedWeb3", {
			talisman: {
				version: "1.0.0",
				enable: async () => ({
					accounts: {
						get: async () => [],
						subscribe: () => {
							throw new Error("Bridge stopped")
						},
					},
					signer: { signPayload: async () => undefined, signRaw: async () => undefined },
				}),
			},
		})
		harness = await load()
		await expect(vi.advanceTimersByTimeAsync(5_000)).rejects.toThrow("Bridge stopped")
		await vi.advanceTimersByTimeAsync(5_000)
		const lookup = lookupOf({ address: alice.address })

		await vi.advanceTimersByTimeAsync(10_000)
		expect(lookup.result).toBeUndefined()
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
		expect(await harness.signingAccountFor({ address: bob.address })).toBeUndefined()
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

		expect(await txCreatorOf({ address: alice.address })).toEqual(expect.any(Function))
		expect(await txCreatorOf({ address: bob.address })).toBeUndefined()
	})
})
