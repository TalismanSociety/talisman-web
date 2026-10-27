import type {
	AppKitInstance,
	WalletConnectPlugin,
	WalletConnectProvider,
	WalletConnectWallet,
	WalletId,
	WalletPlatform,
} from "@kheopskit/core"
import type { WalletConnectOptions } from "@kheopskit/core/walletconnect"
import { BehaviorSubject, combineLatest, map } from "rxjs"

const POLKADOT_ASSET_HUB = "polkadot:68d56f15f85d3136970ec16946040bc1"

type Eip155Account = `eip155:${number}:${string}`

type Session = {
	walletName: string
	addresses: string[]
	evm?: { accounts: [Eip155Account, ...Eip155Account[]]; unresponsive?: boolean }
}

type WalletConnectRequest = { method: string; params?: unknown; chain?: string }

type Pairing = {
	session: Session
	providers: { polkadot?: WalletConnectProvider; eip155?: WalletConnectProvider }
}

const pairing$ = new BehaviorSubject<Pairing | undefined>(undefined)
const connectError$ = new BehaviorSubject<WalletConnectWallet["error"]>(undefined)

export const walletConnectRequests: WalletConnectRequest[] = []

const cannotSign = () => Promise.reject(new Error("The fake WalletConnect wallet cannot sign"))

const polkadotProviderOf = ({ addresses }: Session): WalletConnectProvider => ({
	session: {
		topic: "fake-walletconnect-session",
		namespaces: {
			polkadot: { accounts: addresses.map((address) => `${POLKADOT_ASSET_HUB}:${address}`) },
		},
	},
	client: { request: cannotSign },
	request: cannotSign,
	on: () => undefined,
	off: () => undefined,
})

type Listener = (...args: unknown[]) => void

const eventEmitter = () => {
	const listeners = new Map<string, Set<Listener>>()
	return {
		emit: (event: string, ...args: unknown[]) => {
			for (const listener of listeners.get(event) ?? []) listener(...args)
		},
		on: (event: string, listener: Listener) => {
			listeners.set(event, (listeners.get(event) ?? new Set()).add(listener))
		},
		off: (event: string, listener: Listener) => {
			listeners.get(event)?.delete(listener)
		},
	}
}

const chainIdOf = (account: string) => Number(account.split(":")[1])

const createEip155Wallet = () => {
	const events = eventEmitter()
	const clientEvents = eventEmitter()
	let pairings = 0
	let defaultChainId = 1
	let unresponsive = false
	const provider: WalletConnectProvider & {
		session?: { topic: string; namespaces: { eip155: { accounts: string[] } } }
		client: WalletConnectProvider["client"] & Pick<typeof clientEvents, "on" | "off">
		setDefaultChain: (chain: string) => void
	} = {
		client: { request: cannotSign, on: clientEvents.on, off: clientEvents.off },
		request: async (args: { method: string; params?: unknown }, chain?: string) => {
			walletConnectRequests.push({ ...args, chain })
			if (unresponsive) throw new Error("The fake WalletConnect wallet does not answer")
			if (args.method === "eth_chainId") return defaultChainId
			return `0x${"5".repeat(130)}`
		},
		setDefaultChain: (chain: string) => {
			const previousChainId = defaultChainId
			defaultChainId = chainIdOf(chain)
			events.emit("chainChanged", String(defaultChainId))
			if (previousChainId !== defaultChainId)
				events.emit(
					"accountsChanged",
					(provider.session?.namespaces.eip155.accounts ?? [])
						.filter((account) => chainIdOf(account) === defaultChainId)
						.map((account) => account.split(":")[2])
				)
		},
		on: events.on,
		off: events.off,
	}
	return {
		provider,
		pair: (evm: NonNullable<Session["evm"]>) => {
			provider.session = {
				topic: `fake-walletconnect-session-${++pairings}`,
				namespaces: { eip155: { accounts: [...evm.accounts] } },
			}
			defaultChainId = chainIdOf(evm.accounts[0])
			unresponsive = evm.unresponsive ?? false
		},
		updateAccounts: (accounts: Eip155Account[]) => {
			if (!provider.session) return
			provider.session.namespaces.eip155.accounts = accounts
			events.emit("session_update")
		},
		selectAccounts: (addresses: string[]) => {
			const topic = provider.session?.topic
			events.emit("accountsChanged", addresses)
			clientEvents.emit("session_event", {
				topic,
				params: {
					chainId: `eip155:${defaultChainId}`,
					event: { name: "accountsChanged", data: addresses },
				},
			})
		},
		revoke: () => {
			const topic = provider.session?.topic
			provider.session = undefined
			events.emit("session_delete", { topic })
			events.emit("disconnect", { code: 6000, message: "User disconnected." })
		},
	}
}

let eip155Wallet: ReturnType<typeof createEip155Wallet> | undefined

const pairEip155 = (evm: NonNullable<Session["evm"]>) => {
	eip155Wallet ??= createEip155Wallet()
	eip155Wallet.pair(evm)
	return eip155Wallet.provider
}

const appKitOf = (pairing: Pairing | undefined) => ({
	getProvider: <T>(namespace: string) =>
		pairing?.providers[namespace as keyof Pairing["providers"]] as T | undefined,
	getAccount: () => undefined,
	getCaipNetworks: () => [{ caipNetworkId: POLKADOT_ASSET_HUB }],
	switchNetwork: async () => undefined,
})

const platformsOf = (pairing: Pairing | undefined): WalletPlatform[] => [
	...(pairing?.providers.polkadot ? ["polkadot" as const] : []),
	...(pairing?.providers.eip155 ? ["ethereum" as const] : []),
]

const walletOf = (pairing: Pairing | undefined, error: WalletConnectWallet["error"]) =>
	({
		id: "walletconnect" as WalletId,
		type: "walletconnect",
		platforms: platformsOf(pairing),
		appKit: appKitOf(pairing) satisfies AppKitInstance,
		name: pairing?.session.walletName ?? "WalletConnect",
		icon: "data:image/svg+xml,walletconnect",
		status: pairing ? "connected" : "disconnected",
		isConnected: !!pairing,
		error,
		connect: async () => undefined,
		disconnect: async () => pairing$.next(undefined),
	}) satisfies WalletConnectWallet

export const pairWalletConnect = (session: Session) => {
	walletConnectRequests.length = 0
	pairing$.next({
		session,
		providers: {
			...(session.addresses.length > 0 && { polkadot: polkadotProviderOf(session) }),
			...(session.evm && { eip155: pairEip155(session.evm) }),
		},
	})
}

export const updateEthereumAccounts = (accounts: Eip155Account[]) =>
	eip155Wallet?.updateAccounts(accounts)

export const selectEthereumAccounts = (addresses: string[]) =>
	eip155Wallet?.selectAccounts(addresses)

export const revokeEthereumSession = () => eip155Wallet?.revoke()

export const endWalletConnectSession = () => pairing$.next(undefined)

export const failWalletConnectModal = (error: NonNullable<WalletConnectWallet["error"]>) =>
	connectError$.next(error)

export const walletConnect = (options: WalletConnectOptions): WalletConnectPlugin => ({
	type: "walletconnect",
	metadata: options.metadata,
	getWallet$: () =>
		combineLatest([pairing$, connectError$]).pipe(
			map(([pairing, error]) => walletOf(pairing, error))
		),
})
