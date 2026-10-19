import {
	createKheopskitStore,
	getKheopskit$,
	getWalletId,
	isInjectedWallet,
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
	catchError,
	defer,
	distinct,
	distinctUntilChanged,
	filter,
	firstValueFrom,
	ignoreElements,
	map,
	merge,
	mergeMap,
	NEVER,
	type Observable,
	share,
	shareReplay,
	startWith,
	tap,
} from "rxjs"
import { z } from "zod"
import { track } from "@/domains/analytics/client"
import { substrateWalletOf } from "@/domains/analytics/events/extensions"
import { toast } from "@/ui/molecules/Toaster"
import { persistedState } from "@/util/persistedState"

export type SubstrateWallet = Exclude<PolkadotWallet, { isPlaceholder: true }>

export type InjectedSubstrateAccount = {
	address: string
	name?: string
	type?: PolkadotAccount["type"]
	genesisHash?: string | null
} & ({ readonly?: false } | { readonly: true; partOfPortfolio: boolean })

export type PjsSigner = PolkadotInjected["signer"]

export type TxCreator = InjectedPolkadotAccount["txCreator"]

const AUTO_CONNECT_WALLET_ID = getWalletId("polkadot", "talisman")

const appName = import.meta.env.VITE_APPLICATION_NAME ?? "Talisman"

const store = createKheopskitStore()

const legacyWalletId$ = persistedState(
	"connected-substrate-extension",
	z.string().optional(),
	undefined
)
if (legacyWalletId$.value) store.rememberWallet(getWalletId("polkadot", legacyWalletId$.value))
legacyWalletId$.next(undefined)

const kheopskit$ = defer(() =>
	getKheopskit$(
		{
			appName,
			platforms: [polkadot({ accountTypes: ["sr25519", "ed25519", "ecdsa", "ethereum"] })],
		},
		{ store }
	)
).pipe(
	catchError((error) => {
		console.error("The wallet bridge stopped; keeping the last known wallets and accounts", error)
		return NEVER
	}),
	shareReplay({ bufferSize: 1, refCount: false })
)

const isLiveInjectedWallet = (
	wallet: PolkadotWallet | WalletConnectWallet
): wallet is SubstrateWallet => isInjectedWallet(wallet) && !wallet.isPlaceholder

const injectedWallets$ = kheopskit$.pipe(
	map(({ wallets }) => wallets.filter(isLiveInjectedWallet)),
	shareReplay({ bufferSize: 1, refCount: true })
)

const disconnectAllBut = (wallets: SubstrateWallet[], keptId?: string) =>
	Promise.all(
		wallets
			.filter((wallet) => wallet.status !== "disconnected" && wallet.id !== keptId)
			.map(async (wallet) => {
				await wallet.disconnect().catch((error) => console.error(error))
				store.forgetWallet(wallet.id)
			})
	)

const boot = async () => {
	const { remembered = [] } = await firstValueFrom(store.observable)
	const wanted = await firstValueFrom(
		kheopskit$.pipe(
			map(({ isDiscovering, wallets }) => ({
				isDiscovering,
				wanted: wallets
					.filter(isLiveInjectedWallet)
					.find((wallet) => wallet.id === (remembered[0] ?? AUTO_CONNECT_WALLET_ID)),
			})),
			filter(({ isDiscovering, wanted }) => !isDiscovering || wanted !== undefined),
			map(({ wanted }) => wanted)
		)
	)
	if (wanted && remembered.length === 0) await wanted.connect().catch(() => undefined)
	await firstValueFrom(
		kheopskit$.pipe(
			filter(({ isHydrating, accounts, wallets }) =>
				isHydrating
					? accounts.length > 0
					: wallets.every((wallet) => wallet.status !== "connecting")
			)
		)
	)
	return true
}

const initialised$ = defer(boot).pipe(
	startWith(false),
	shareReplay({ bufferSize: 1, refCount: false })
)

export const [useInitialisedSubstrateWallets, initialisedSubstrateWallets$] = bind(initialised$)

export const [useConnectedSubstrateWallet, connectedSubstrateWallet$] = bind(
	injectedWallets$.pipe(map((wallets) => wallets.find((wallet) => wallet.isConnected))),
	undefined
)

const connectionTracking$ = connectedSubstrateWallet$.pipe(
	distinctUntilChanged((previous, next) => previous?.id === next?.id),
	tap((wallet) => {
		if (wallet)
			track("Substrate extensions connected", { wallet: substrateWalletOf(wallet.sourceId) })
	})
)

const connectionErrors$ = injectedWallets$.pipe(
	mergeMap((wallets) => wallets.flatMap((wallet) => (wallet.error ? [wallet.error] : []))),
	distinct(),
	tap((error) => {
		toast.error("Wallet connection declined")
		console.error(error)
	})
)

export const substrateWalletLifecycle$: Observable<never> = merge(
	initialised$,
	connectionTracking$,
	connectionErrors$
).pipe(ignoreElements(), share({ resetOnRefCountZero: false }))

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
	const account = accounts.find((account) => account.address === address)
	return account?.isPlaceholder ? undefined : account?.txCreator
}

export const [useInstalledSubstrateWallets, installedSubstrateWallets$] = bind(injectedWallets$, [])

export const connectSubstrateWallet = async (wallet: SubstrateWallet) => {
	await disconnectAllBut(await firstValueFrom(injectedWallets$), wallet.id)
	await wallet.connect().catch(() => undefined)
}

export const disconnectSubstrateWallet = async () =>
	disconnectAllBut(await firstValueFrom(injectedWallets$))
