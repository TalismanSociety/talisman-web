import { getWalletAccountId, KheopskitError } from "@kheopskit/core"
import { createFakePolkadotExtension } from "@kheopskit/core/testing"
import { filter, firstValueFrom } from "rxjs"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { alice, bob, load } from "./substrate.fixtures"

const { toast, capture } = vi.hoisted(() => ({
	toast: { error: vi.fn(), success: vi.fn() },
	capture: vi.fn(),
}))
vi.mock("@/ui/molecules/Toaster", () => ({ toast }))
vi.mock("@/domains/analytics/client", () => ({ track: capture }))

describe("substrate wallets over WalletConnect", () => {
	let harness: Awaited<ReturnType<typeof load>>

	const loadWithWalletConnect = async () => {
		harness = await load()
		return import("@/test/walletconnect")
	}

	const walletConnectWallet = () =>
		firstValueFrom(harness.walletConnectWallet$.pipe(filter((wallet) => wallet !== undefined)))

	beforeEach(() => {
		localStorage.clear()
		toast.error.mockClear()
	})

	afterEach(() => harness.dispose())

	it("offers WalletConnect next to the extensions, then signs with the paired wallet's accounts", async () => {
		createFakePolkadotExtension({ name: "talisman", accounts: [alice] })
		const { pairWalletConnect } = await loadWithWalletConnect()
		await vi.waitFor(() => expect(harness.connected()).toEqual(["polkadot:talisman"]))
		expect(await walletConnectWallet()).toMatchObject({
			name: "WalletConnect",
			isConnected: false,
		})

		pairWalletConnect({ walletName: "Nova Wallet", addresses: [bob.address] })

		await vi.waitFor(() =>
			expect(harness.accounts()).toEqual([
				["Guardians SUB", alice.address, "sr25519"],
				["Nova Wallet Polkadot", bob.address, "sr25519"],
			])
		)
		expect(await walletConnectWallet()).toMatchObject({ name: "Nova Wallet", isConnected: true })
		const walletAccountId = getWalletAccountId("walletconnect", bob.address)
		expect(await harness.signableWalletAccountsOf(bob.address)).toEqual([
			expect.objectContaining({ walletAccountId, walletName: "Nova Wallet" }),
		])
		const signing = await harness.waitForSigningAccount(walletAccountId)
		expect(signing?.account.txCreator).toBeTypeOf("function")
		expect(signing?.pjsSigner).toBeUndefined()
	})

	it("toasts when the WalletConnect modal fails to open", async () => {
		vi.spyOn(console, "error").mockImplementation(() => undefined)
		const { failWalletConnectModal } = await loadWithWalletConnect()

		failWalletConnectModal(new KheopskitError("CONNECT_FAILED", "AppKit failed to open"))

		await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith("WalletConnect failed to open"))
		expect(toast.error).toHaveBeenCalledTimes(1)
	})
})
