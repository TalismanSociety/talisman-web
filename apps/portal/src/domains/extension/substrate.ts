import { getKheopskit$, isInjectedWallet, type WalletConnectWallet } from "@kheopskit/core"
import {
	type PolkadotAccount,
	type PolkadotInjected,
	type PolkadotWallet,
	polkadot,
} from "@kheopskit/core/polkadot"
import { bind } from "@react-rxjs/core"
import type { InjectedPolkadotAccount } from "polkadot-api/pjs-signer"
import {
	BehaviorSubject,
	catchError,
	combineLatest,
	defer,
	distinctUntilChanged,
	filter,
	firstValueFrom,
	fromEvent,
	ignoreElements,
	map,
	merge,
	NEVER,
	type Observable,
	of,
	shareReplay,
	switchMap,
	take,
	tap,
} from "rxjs"
import { z } from "zod"
import polkadotJsWalletLogo from "@/assets/polkadot-js-wallet.svg"
import talismanWalletLogo from "@/assets/talisman-wallet.svg"
import { track } from "@/domains/analytics/client"
import { substrateWalletOf } from "@/domains/analytics/events/extensions"
import { toast } from "@/ui/molecules/Toaster"
import { persistedState } from "@/util/persistedState"

export type SubstrateWallet = { id: string; title: string; iconUrl?: string }

export type InjectedSubstrateAccount = {
	address: string
	name?: string
	type?: PolkadotAccount["type"]
	genesisHash?: string | null
} & ({ readonly?: false } | { readonly: true; partOfPortfolio: boolean })

type LivePolkadotWallet = Exclude<PolkadotWallet, { isPlaceholder: true }>

export type PjsSigner = PolkadotInjected["signer"]

export type SubstrateWalletConnection = { id: string; signer: PjsSigner }

export type TxCreator = InjectedPolkadotAccount["txCreator"]

const WALLET_METADATA: Record<string, Omit<SubstrateWallet, "id">> = {
	talisman: { title: "Talisman", iconUrl: talismanWalletLogo },
	"polkadot-js": { title: "Polkadot.js", iconUrl: polkadotJsWalletLogo },
}

const AUTO_CONNECT_WALLET_ID = "talisman"

const appName = import.meta.env.VITE_APPLICATION_NAME ?? "Talisman"

const connectedSubstrateWalletId$ = persistedState(
	"connected-substrate-extension",
	z.string().optional(),
	undefined
)

const pageLoaded$ = defer(() =>
	document.readyState === "complete" ? of(undefined) : fromEvent(window, "load").pipe(take(1))
)

const kheopskit$ = pageLoaded$.pipe(
	switchMap(() =>
		getKheopskit$({
			appName,
			platforms: [polkadot({ accountTypes: ["sr25519", "ed25519", "ecdsa", "ethereum"] })],
			autoReconnect: false,
			hydrationGracePeriod: 0,
		})
	),
	catchError((error) => {
		console.error("The wallet bridge stopped; keeping the last known wallets and accounts", error)
		return NEVER
	}),
	shareReplay({ bufferSize: 1, refCount: false })
)

const injectionOrder = (wallet: LivePolkadotWallet) =>
	Object.keys(window.injectedWeb3 ?? {}).indexOf(wallet.sourceId)

const isLiveInjectedWallet = (
	wallet: PolkadotWallet | WalletConnectWallet
): wallet is LivePolkadotWallet => isInjectedWallet(wallet) && !wallet.isPlaceholder

const injectedWallets$ = kheopskit$.pipe(
	map(({ wallets }) =>
		wallets.filter(isLiveInjectedWallet).sort((a, b) => injectionOrder(a) - injectionOrder(b))
	),
	shareReplay({ bufferSize: 1, refCount: true })
)

const connectRequests = new Map<string, Promise<void>>()

const connectOnce = (wallet: LivePolkadotWallet) => {
	const pending = connectRequests.get(wallet.sourceId)
	if (pending) return pending
	const request = wallet
		.connect()
		.then(
			() => {
				track("Substrate extensions connected", { wallet: substrateWalletOf(wallet.sourceId) })
			},
			(error) => {
				connectedSubstrateWalletId$.next(undefined)
				toast.error("Wallet connection declined")
				console.error(error)
			}
		)
		.finally(() => connectRequests.delete(wallet.sourceId))
	connectRequests.set(wallet.sourceId, request)
	return request
}

const disconnectUnwanted = (wallets: LivePolkadotWallet[], wantedId: string | undefined) => {
	for (const wallet of wallets)
		if (wallet.isConnected && wallet.sourceId !== wantedId)
			wallet.disconnect().catch((error) => console.error(error))
}

const initialised$ = new BehaviorSubject(false)

const listsWallet = (wallets: LivePolkadotWallet[], id: string | undefined) =>
	wallets.some((wallet) => wallet.sourceId === id)

const walletsSettled$ = kheopskit$.pipe(
	map(({ isDiscovering, wallets }) => ({
		isDiscovering,
		wallets: wallets.filter(isLiveInjectedWallet),
	})),
	filter(
		({ isDiscovering, wallets }) =>
			!isDiscovering ||
			listsWallet(wallets, connectedSubstrateWalletId$.value ?? AUTO_CONNECT_WALLET_ID)
	),
	take(1),
	map(({ wallets }) => wallets)
)

const boot$ = walletsSettled$.pipe(
	switchMap(async (wallets) => {
		if (
			connectedSubstrateWalletId$.value === undefined &&
			listsWallet(wallets, AUTO_CONNECT_WALLET_ID)
		)
			connectedSubstrateWalletId$.next(AUTO_CONNECT_WALLET_ID)
		const wanted = wallets.find((wallet) => wallet.sourceId === connectedSubstrateWalletId$.value)
		if (wanted && !wanted.isConnected) await connectOnce(wanted)
		initialised$.next(true)
	})
)

const driver$ = combineLatest([injectedWallets$, connectedSubstrateWalletId$]).pipe(
	tap(([wallets, wantedId]) => {
		disconnectUnwanted(wallets, wantedId)
		const wanted = wallets.find((wallet) => wallet.sourceId === wantedId)
		if (wanted && !wanted.isConnected) void connectOnce(wanted)
	})
)

const connectedWallet$ = combineLatest([injectedWallets$, connectedSubstrateWalletId$]).pipe(
	map(([wallets, id]) => wallets.find((wallet) => wallet.sourceId === id && wallet.isConnected)),
	distinctUntilChanged(),
	map((wallet): SubstrateWalletConnection | undefined =>
		wallet?.extension ? { id: wallet.sourceId, signer: wallet.extension.signer } : undefined
	),
	shareReplay({ bufferSize: 1, refCount: true })
)

export const [useConnectedSubstrateWallet, connectedSubstrateWallet$] = bind(
	connectedWallet$,
	undefined
)

export const substrateWalletLifecycle$: Observable<never> = merge(
	boot$,
	driver$,
	connectedSubstrateWallet$
).pipe(ignoreElements())

const toInjectedAccount = ({
	address,
	name,
	type,
	genesisHash,
	readonly,
	partOfPortfolio,
}: PolkadotAccount): InjectedSubstrateAccount =>
	readonly
		? { address, name, type, genesisHash, readonly, partOfPortfolio: partOfPortfolio ?? false }
		: { address, name, type, genesisHash }

export const injectedSubstrateAccounts$: Observable<InjectedSubstrateAccount[]> = combineLatest([
	kheopskit$,
	connectedSubstrateWalletId$,
]).pipe(
	map(([{ wallets, accounts }, id]) => {
		const wallet = wallets.filter(isLiveInjectedWallet).find((wallet) => wallet.sourceId === id)
		return wallet?.isConnected
			? accounts.filter((account) => account.walletId === wallet.id).map(toInjectedAccount)
			: []
	}),
	shareReplay({ bufferSize: 1, refCount: true })
)

export const txCreatorOf = async (address: string): Promise<TxCreator | undefined> => {
	const { accounts } = await firstValueFrom(kheopskit$)
	return accounts.find((account) => account.address === address)?.txCreator
}

const toSubstrateWallet = (wallet: LivePolkadotWallet): SubstrateWallet => ({
	id: wallet.sourceId,
	...(WALLET_METADATA[wallet.sourceId] ?? { title: wallet.sourceId }),
})

export const [useInstalledSubstrateWallets, installedSubstrateWallets$] = bind(
	injectedWallets$.pipe(map((wallets) => wallets.map(toSubstrateWallet))),
	[]
)

export const initialisedSubstrateWallets$: Observable<boolean> = initialised$

export const [useInitialisedSubstrateWallets] = bind(initialised$)

export const connectSubstrateWallet = (wallet: SubstrateWallet) =>
	connectedSubstrateWalletId$.next(wallet.id)

export const disconnectSubstrateWallet = () => connectedSubstrateWalletId$.next(undefined)
