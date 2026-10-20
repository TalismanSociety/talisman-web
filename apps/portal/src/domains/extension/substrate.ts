import {
	createKheopskit,
	getWalletId,
	isInjectedWallet,
	isWalletConnectWallet,
	type WalletAccountId,
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
	timeout,
} from "rxjs"
import { z } from "zod"
import { track } from "@/domains/analytics/client"
import { substrateWalletOf } from "@/domains/analytics/events/extensions"
import { toast } from "@/ui/molecules/Toaster"
import { persistedState } from "@/util/persistedState"
import { appName, portalWalletConnect } from "./walletconnect"

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

const SIGNING_WALLET_WAIT_MS = 10_000

const { kheopskit$: liveKheopskit$, store } = createKheopskit({
	appName,
	platforms: [polkadot({ accountTypes: ["sr25519", "ed25519", "ecdsa", "ethereum"] })],
	walletConnect: portalWalletConnect,
})

const legacyWalletId$ = persistedState(
	"connected-substrate-extension",
	z.string().optional(),
	undefined
)
if (legacyWalletId$.value) store.rememberWallet(getWalletId("polkadot", legacyWalletId$.value))
legacyWalletId$.next(undefined)

const kheopskit$ = liveKheopskit$.pipe(
	catchError((error) => {
		console.error("The wallet bridge stopped; keeping the last known wallets and accounts", error)
		return NEVER
	}),
	shareReplay({ bufferSize: 1, refCount: false })
)

const isLiveInjectedWallet = (
	wallet: PolkadotWallet | WalletConnectWallet
): wallet is SubstrateWallet => isInjectedWallet(wallet) && !wallet.isPlaceholder

type LiveWalletConnectWallet = Exclude<WalletConnectWallet, { isPlaceholder: true }>

const isLiveWalletConnectWallet = (
	wallet: PolkadotWallet | WalletConnectWallet
): wallet is LiveWalletConnectWallet => isWalletConnectWallet(wallet) && !wallet.isPlaceholder

type KheopskitState = ObservedValueOf<typeof kheopskit$>

const showsCachedAccounts = ({ isHydrating, accounts }: KheopskitState) =>
	isHydrating && accounts.length > 0

const isSettled = ({ isHydrating, wallets }: KheopskitState) =>
	!isHydrating && wallets.every((wallet) => wallet.status !== "connecting")

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
	await firstValueFrom(kheopskit$.pipe(filter(isSettled)))
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

const connectionErrors$ = kheopskit$.pipe(
	mergeMap(({ wallets }) =>
		wallets.flatMap((wallet) => (!wallet.isPlaceholder && wallet.error ? [wallet] : []))
	),
	distinct((wallet) => wallet.error),
	tap((wallet) => {
		toast.error(
			isWalletConnectWallet(wallet) ? "WalletConnect failed to open" : "Wallet connection declined"
		)
		console.error(wallet.error)
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

const isWatchOnlyCopy = (account: PolkadotAccount, accounts: PolkadotAccount[]) =>
	account.readonly && accounts.some((other) => other.address === account.address && !other.readonly)

export const injectedSubstrateAccounts$: Observable<InjectedSubstrateAccount[]> = kheopskit$.pipe(
	map(({ accounts }) =>
		accounts.filter((account) => !isWatchOnlyCopy(account, accounts)).map(toInjectedAccount)
	),
	shareReplay({ bufferSize: 1, refCount: true })
)

export type WalletAccountRef = { walletAccountId: WalletAccountId; walletName: string }

export type WalletAccount = InjectedSubstrateAccount & WalletAccountRef

type LivePolkadotAccount = Exclude<PolkadotAccount, { isPlaceholder: true }>

const toWalletAccount = (account: PolkadotAccount): WalletAccount => ({
	...toInjectedAccount(account),
	walletAccountId: account.id,
	walletName: account.walletName,
})

const isWritable = (account: PolkadotAccount) => !account.readonly

export const walletAccounts$: Observable<WalletAccount[]> = kheopskit$.pipe(
	map(({ accounts }) => accounts.filter(isWritable).map(toWalletAccount)),
	shareReplay({ bufferSize: 1, refCount: true })
)

const listingsWhen = async (matches: (account: PolkadotAccount) => boolean) => {
	const { accounts, wallets } = await firstValueFrom(
		kheopskit$.pipe(
			filter((state) => isSettled(state) || state.accounts.some(matches)),
			timeout({ first: SIGNING_WALLET_WAIT_MS, with: () => kheopskit$ })
		)
	)
	return { listings: accounts.filter(matches), wallets }
}

export const signableWalletAccountsOf = async (address: string) => {
	const { listings } = await listingsWhen(
		(account) => account.address === address && isWritable(account)
	)
	return listings.map(toWalletAccount)
}

const isLiveListingOf =
	(walletAccountId: WalletAccountId) =>
	(account: PolkadotAccount): account is LivePolkadotAccount =>
		account.id === walletAccountId && isWritable(account) && !account.isPlaceholder

export const waitForSigningAccount = async (walletAccountId: WalletAccountId) => {
	const { listings, wallets } = await listingsWhen(isLiveListingOf(walletAccountId))
	const account = listings.find(isLiveListingOf(walletAccountId))
	if (!account) return undefined
	const wallet = wallets.filter(isLiveInjectedWallet).find(({ id }) => id === account.walletId)
	return { account, pjsSigner: wallet?.extension?.signer }
}

export const [useInstalledSubstrateWallets, installedSubstrateWallets$] = bind(injectedWallets$, [])

export const [useWalletConnectWallet, walletConnectWallet$] = bind(
	kheopskit$.pipe(map(({ wallets }) => wallets.find(isLiveWalletConnectWallet))),
	undefined
)
