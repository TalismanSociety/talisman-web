import { vi } from "vitest"
import type { Account } from "@/domains/accounts/accounts"
import type { SubstrateWallet, SubstrateWalletConnection } from "./substrate"

export const alice = {
	address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
	name: "Guardians SUB",
	type: "sr25519",
}
export const bob = {
	address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
	name: "Bob",
	type: "sr25519",
}
export const evm = {
	address: "0x5C9EBa3b10E45BF6db77267B40B95F3f91Fc5f67",
	name: "Guardians EVM",
	type: "ethereum",
}
export const watched = {
	address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
	name: "Watched",
	type: "sr25519",
	readonly: true,
	partOfPortfolio: false,
}

type FakeAccount = typeof alice | typeof watched

export const fakeWallet = (authorised: FakeAccount[]) => {
	let accounts: FakeAccount[] = []
	const listeners = new Set<(accounts: FakeAccount[]) => void>()
	const publish = (next: FakeAccount[]) => {
		accounts = next
		for (const listener of listeners) listener(next)
	}
	const signer = { signPayload: vi.fn(), signRaw: vi.fn() }
	const enable = vi.fn(async (_dappName?: string) => {
		accounts = authorised
		return {
			accounts: {
				get: async () => accounts,
				subscribe: (listener: (accounts: FakeAccount[]) => void) => {
					listeners.add(listener)
					return () => listeners.delete(listener)
				},
			},
			signer,
		}
	})
	return { enable, publish, signer }
}

export const refusingWallet = () => {
	const wallet = fakeWallet([])
	wallet.enable.mockImplementation(async () => {
		throw new Error("Rejected")
	})
	return wallet
}

export const load = async (injectedWeb3: Record<string, { enable: unknown }> | undefined) => {
	vi.resetModules()
	vi.stubGlobal("injectedWeb3", injectedWeb3)
	const extension = await import("./substrate")
	const accountsModule = await import("@/domains/accounts/accounts")
	const lifecycle = extension.substrateWalletLifecycle$.subscribe()
	let wallets: SubstrateWallet[] = []
	let connected: SubstrateWalletConnection | undefined
	let accounts: Account[] = []
	let initialised = false
	const subscriptions = [
		extension.installedSubstrateWallets$.subscribe((next) => {
			wallets = next
		}),
		extension.connectedSubstrateWallet$.subscribe((next) => {
			connected = next
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
		connected: () => connected,
		initialised: () => initialised,
		accounts: () => accounts.map((account) => [account.name, account.address, account.type]),
		dispose: () => {
			lifecycle.unsubscribe()
			for (const subscription of subscriptions) subscription.unsubscribe()
		},
	}
}
