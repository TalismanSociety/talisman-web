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
	first,
	firstValueFrom,
	groupBy,
	ignoreElements,
	map,
	merge,
	mergeMap,
	NEVER,
	type Observable,
	type ObservedValueOf,
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

const showsCachedAccounts = ({ isHydrating, accounts }: ObservedValueOf<typeof kheopskit$>) =>
	isHydrating && accounts.length > 0

const injectedWallets$ = kheopskit$.pipe(
	map(({ wallets }) => wallets.filter(isLiveInjectedWallet)),
	shareReplay({ bufferSize: 1, refCount: true })
)

const boot = async () => {
	const { remembered = [] } = await firstValueFrom(store.observable)
	const wantedIds = remembered.length > 0 ? remembered : [AUTO_CONNECT_WALLET_ID]
	const wanted = await firstValueFrom(
		kheopskit$.pipe(
			map(({ isDiscovering, wallets }) => ({
				isDiscovering,
				wanted: wallets
					.filter(isLiveInjectedWallet)
					.filter((wallet) => wantedIds.includes(wallet.id)),
			})),
			filter(({ isDiscovering, wanted }) => !isDiscovering || wanted.length === wantedIds.length),
			map(({ wanted }) => wanted)
		)
	)
	if (remembered.length === 0)
		await Promise.all(wanted.map((wallet) => wallet.connect().catch(() => undefined)))
	await firstValueFrom(
		kheopskit$.pipe(
			filter(
				({ isHydrating, wallets }) =>
					!isHydrating && wallets.every((wallet) => wallet.status !== "connecting")
			)
		)
	)
	return true
}

const initialised$ = merge(defer(boot), kheopskit$.pipe(filter(showsCachedAccounts))).pipe(
	first(),
	map(() => true),
	startWith(false),
	shareReplay({ bufferSize: 1, refCount: false })
)

export const [useInitialisedSubstrateWallets, initialisedSubstrateWallets$] = bind(initialised$)

export const [useHasConnectedSubstrateWallet, hasConnectedSubstrateWallet$] = bind(
	kheopskit$.pipe(
		map(
			(state) => showsCachedAccounts(state) || state.wallets.some((wallet) => wallet.isConnected)
		),
		distinctUntilChanged()
	),
	false
)

const connectionTracking$ = injectedWallets$.pipe(
	mergeMap((wallets) => wallets),
	groupBy((wallet) => wallet.id),
	mergeMap((walletUpdates) =>
		walletUpdates.pipe(
			distinctUntilChanged((previous, next) => previous.isConnected === next.isConnected),
			filter((wallet) => wallet.isConnected)
		)
	),
	tap((wallet) =>
		track("Substrate extensions connected", { wallet: substrateWalletOf(wallet.sourceId) })
	)
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
	hasConnectedSubstrateWallet$,
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

const preferredListingOf = (accounts: PolkadotAccount[], address: string) =>
	accounts.find((account) => account.address === address && !account.readonly) ??
	accounts.find((account) => account.address === address)

export const injectedSubstrateAccounts$: Observable<InjectedSubstrateAccount[]> = kheopskit$.pipe(
	map(({ accounts }) =>
		accounts
			.filter((account) => preferredListingOf(accounts, account.address) === account)
			.map(toInjectedAccount)
	),
	shareReplay({ bufferSize: 1, refCount: true })
)

export const txCreatorOf = async (address: string): Promise<TxCreator | undefined> => {
	const { accounts } = await firstValueFrom(kheopskit$)
	const account = preferredListingOf(accounts, address)
	return account?.isPlaceholder ? undefined : account?.txCreator
}

export const pjsSignerOf = async (address: string): Promise<PjsSigner | undefined> => {
	const { accounts, wallets } = await firstValueFrom(kheopskit$)
	const listingWalletId = preferredListingOf(accounts, address)?.walletId
	const connected = wallets.filter(isLiveInjectedWallet).filter((wallet) => wallet.isConnected)
	return (connected.find((wallet) => wallet.id === listingWalletId) ?? connected[0])?.extension
		?.signer
}

export const [useInstalledSubstrateWallets, installedSubstrateWallets$] = bind(injectedWallets$, [])
