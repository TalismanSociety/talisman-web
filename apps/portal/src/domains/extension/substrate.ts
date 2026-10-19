import {
	getKheopskit$,
	isInjectedWallet,
	KheopskitError,
	type WalletConnectWallet,
} from "@kheopskit/core"
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
	defer,
	distinctUntilChanged,
	filter,
	firstValueFrom,
	ignoreElements,
	map,
	merge,
	NEVER,
	type Observable,
	shareReplay,
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

const kheopskit$ = defer(() =>
	getKheopskit$({
		appName,
		platforms: [polkadot({ accountTypes: ["sr25519", "ed25519", "ecdsa", "ethereum"] })],
		autoReconnect: false,
		hydrationGracePeriod: 0,
	})
).pipe(
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

const connect = (wallet: LivePolkadotWallet) => {
	connectedSubstrateWalletId$.next(wallet.sourceId)
	return wallet.connect().then(
		() => {
			track("Substrate extensions connected", { wallet: substrateWalletOf(wallet.sourceId) })
		},
		(error) => {
			if (error instanceof KheopskitError && error.code === "ABORTED") return
			connectedSubstrateWalletId$.next(undefined)
			toast.error("Wallet connection declined")
			console.error(error)
		}
	)
}

const disconnectAllBut = (wallets: LivePolkadotWallet[], keptId?: string) =>
	Promise.all(
		wallets
			.filter((wallet) => wallet.status !== "disconnected" && wallet.sourceId !== keptId)
			.map((wallet) => wallet.disconnect().catch((error) => console.error(error)))
	)

const initialised$ = new BehaviorSubject(false)

const boot = async () => {
	const wantedId = connectedSubstrateWalletId$.value ?? AUTO_CONNECT_WALLET_ID
	const wanted = await firstValueFrom(
		kheopskit$.pipe(
			map(({ isDiscovering, wallets }) => ({
				isDiscovering,
				wanted: wallets.filter(isLiveInjectedWallet).find((wallet) => wallet.sourceId === wantedId),
			})),
			filter(({ isDiscovering, wanted }) => !isDiscovering || wanted !== undefined),
			map(({ wanted }) => wanted)
		)
	)
	if (wanted) await connect(wanted)
	initialised$.next(true)
}

const connectedWallet$ = injectedWallets$.pipe(
	map((wallets) => wallets.find((wallet) => wallet.isConnected)),
	distinctUntilChanged(),
	map((wallet): SubstrateWalletConnection | undefined =>
		wallet?.extension ? { id: wallet.sourceId, signer: wallet.extension.signer } : undefined
	)
)

export const [useConnectedSubstrateWallet, connectedSubstrateWallet$] = bind(
	connectedWallet$,
	undefined
)

const boot$ = defer(boot).pipe(shareReplay({ bufferSize: 1, refCount: false }))

export const substrateWalletLifecycle$: Observable<never> = merge(
	boot$,
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

export const injectedSubstrateAccounts$: Observable<InjectedSubstrateAccount[]> = kheopskit$.pipe(
	map(({ accounts }) => accounts.map(toInjectedAccount)),
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

export const [useInitialisedSubstrateWallets, initialisedSubstrateWallets$] = bind(initialised$)

export const connectSubstrateWallet = async ({ id }: SubstrateWallet) => {
	const wallets = await firstValueFrom(injectedWallets$)
	await disconnectAllBut(wallets, id)
	const wallet = wallets.find((wallet) => wallet.sourceId === id)
	if (wallet) await connect(wallet)
}

export const disconnectSubstrateWallet = async () => {
	connectedSubstrateWalletId$.next(undefined)
	await disconnectAllBut(await firstValueFrom(injectedWallets$))
}
