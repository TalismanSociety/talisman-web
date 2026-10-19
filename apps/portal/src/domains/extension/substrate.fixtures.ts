import { createKheopskitStore } from "@kheopskit/core"
import type { FakePolkadotAccount } from "@kheopskit/core/testing"
import { vi } from "vitest"
import type { Account } from "@/domains/accounts/accounts"
import type { SubstrateWallet } from "./substrate"

export const alice = {
	address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
	name: "Guardians SUB",
	type: "sr25519",
} satisfies FakePolkadotAccount
export const bob = {
	address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
	name: "Bob",
	type: "sr25519",
} satisfies FakePolkadotAccount
export const evm = {
	address: "0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67",
	name: "Guardians EVM",
	type: "ethereum",
} satisfies FakePolkadotAccount
export const watched = {
	address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
	name: "Watched",
	type: "sr25519",
	readonly: true,
	partOfPortfolio: false,
} satisfies FakePolkadotAccount

export const remember = (walletId: string) => {
	const seed = createKheopskitStore()
	seed.rememberWallet(walletId)
	seed.destroy()
}

const remembered = (): unknown =>
	JSON.parse(localStorage.getItem("kheopskit") ?? "{}").remembered ?? []

export const load = async () => {
	vi.resetModules()
	const extension = await import("./substrate")
	const accountsModule = await import("@/domains/accounts/accounts")
	const lifecycle = extension.substrateWalletLifecycle$.subscribe()
	let wallets: SubstrateWallet[] = []
	let accounts: Account[] = []
	let initialised = false
	const subscriptions = [
		extension.installedSubstrateWallets$.subscribe((next) => {
			wallets = next
		}),
		extension.initialisedSubstrateWallets$.subscribe((next) => {
			initialised = next
		}),
		accountsModule.injectedAccounts$.subscribe((next) => {
			accounts = next
		}),
	]
	return {
		...extension,
		...accountsModule,
		wallets: () => wallets,
		wallet: (id: string) => {
			const wallet = wallets.find((wallet) => wallet.id === id)
			if (!wallet) throw new Error(`${id} is not installed`)
			return wallet
		},
		remembered,
		unmountLifecycle: () => lifecycle.unsubscribe(),
		connected: () => wallets.filter((wallet) => wallet.isConnected).map((wallet) => wallet.id),
		initialised: () => initialised,
		accounts: () => accounts.map((account) => [account.name, account.address, account.type]),
		dispose: () => {
			lifecycle.unsubscribe()
			for (const subscription of subscriptions) subscription.unsubscribe()
			Reflect.deleteProperty(globalThis, "injectedWeb3")
			localStorage.clear()
			window.dispatchEvent(new StorageEvent("storage", { key: "kheopskit", newValue: null }))
		},
	}
}
