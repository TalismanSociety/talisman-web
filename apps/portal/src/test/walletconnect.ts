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
	providers: { polkadot?: WalletConnectProvider; eip155?: Eip155Provider }
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

type Eip155Provider = WalletConnectProvider & {
	setDefaultChain: (chain: string) => void
	updateAccounts: (accounts: Eip155Account[]) => void
}

const eip155ProviderOf = ({
	accounts,
	unresponsive,
}: NonNullable<Session["evm"]>): Eip155Provider => {
	const listeners = new Map<string, Set<(...args: unknown[]) => void>>()
	const emit = (event: string, ...args: unknown[]) => {
		for (const listener of listeners.get(event) ?? []) listener(...args)
	}
	let defaultChainId = Number(accounts[0].split(":")[1])
	const session = {
		topic: "fake-walletconnect-session",
		namespaces: { eip155: { accounts: accounts as string[] } },
	}
	return {
		session,
		client: { request: cannotSign },
		request: async (args: { method: string; params?: unknown }, chain?: string) => {
			walletConnectRequests.push({ ...args, chain })
			if (unresponsive) throw new Error("The fake WalletConnect wallet does not answer")
			if (args.method === "eth_chainId") return defaultChainId
			return `0x${"5".repeat(130)}`
		},
		setDefaultChain: (chain: string) => {
			defaultChainId = Number(chain.split(":")[1])
			emit("chainChanged", String(defaultChainId))
		},
		updateAccounts: (accounts) => {
			session.namespaces.eip155.accounts = accounts
			emit("session_update")
		},
		on: (event: string, listener: (...args: unknown[]) => void) => {
			listeners.set(event, (listeners.get(event) ?? new Set()).add(listener))
		},
		off: (event: string, listener: (...args: unknown[]) => void) => {
			listeners.get(event)?.delete(listener)
		},
	}
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
			...(session.evm && { eip155: eip155ProviderOf(session.evm) }),
		},
	})
}

export const updateEthereumAccounts = (accounts: Eip155Account[]) =>
	pairing$.value?.providers.eip155?.updateAccounts(accounts)

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
