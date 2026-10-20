import type {
	AppKitInstance,
	WalletConnectPlugin,
	WalletConnectProvider,
	WalletConnectWallet,
	WalletId,
} from "@kheopskit/core"
import type { WalletConnectOptions } from "@kheopskit/core/walletconnect"
import { BehaviorSubject, combineLatest, map } from "rxjs"

const POLKADOT_ASSET_HUB = "polkadot:68d56f15f85d3136970ec16946040bc1"

type Session = { walletName: string; addresses: string[] }

const session$ = new BehaviorSubject<Session | undefined>(undefined)
const connectError$ = new BehaviorSubject<WalletConnectWallet["error"]>(undefined)

const providerOf = ({ addresses }: Session): WalletConnectProvider => ({
	session: {
		topic: "fake-walletconnect-session",
		namespaces: {
			polkadot: { accounts: addresses.map((address) => `${POLKADOT_ASSET_HUB}:${address}`) },
		},
	},
	client: { request: () => Promise.reject(new Error("The fake WalletConnect wallet cannot sign")) },
	request: () => Promise.reject(new Error("The fake WalletConnect wallet cannot sign")),
	on: () => undefined,
	off: () => undefined,
})

const appKitOf = (session: Session | undefined): AppKitInstance => ({
	getProvider: <T>(namespace: string) =>
		(namespace === "polkadot" && session ? providerOf(session) : undefined) as T | undefined,
	getAccount: () => undefined,
	getCaipNetworks: () => [{ caipNetworkId: POLKADOT_ASSET_HUB }],
})

const walletOf = (session: Session | undefined, error: WalletConnectWallet["error"]) =>
	({
		id: "walletconnect" as WalletId,
		type: "walletconnect",
		platforms: session ? ["polkadot"] : [],
		appKit: appKitOf(session),
		name: session?.walletName ?? "WalletConnect",
		icon: "data:image/svg+xml,walletconnect",
		status: session ? "connected" : "disconnected",
		isConnected: !!session,
		error,
		connect: async () => undefined,
		disconnect: async () => session$.next(undefined),
	}) satisfies WalletConnectWallet

export const pairWalletConnect = (session: Session) => session$.next(session)

export const failWalletConnectModal = (error: NonNullable<WalletConnectWallet["error"]>) =>
	connectError$.next(error)

export const walletConnect = (options: WalletConnectOptions): WalletConnectPlugin => ({
	type: "walletconnect",
	metadata: options.metadata,
	getWallet$: () =>
		combineLatest([session$, connectError$]).pipe(
			map(([session, error]) => walletOf(session, error))
		),
})
