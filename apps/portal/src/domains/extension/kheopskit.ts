import {
	createKheopskit,
	getWalletId,
	isWalletConnectWallet,
	type WalletConnectWallet,
} from "@kheopskit/core"
import { type PolkadotWallet, polkadot } from "@kheopskit/core/polkadot"
import { bind } from "@react-rxjs/core"
import { catchError, map, NEVER, shareReplay } from "rxjs"
import { z } from "zod"
import { persistedState } from "@/util/persistedState"
import { appName, portalWalletConnect } from "./walletconnect"

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

export { store }

export const kheopskit$ = liveKheopskit$.pipe(
	catchError((error) => {
		console.error("The wallet bridge stopped; keeping the last known wallets and accounts", error)
		return NEVER
	}),
	shareReplay({ bufferSize: 1, refCount: false })
)

export type LiveWalletConnectWallet = Exclude<WalletConnectWallet, { isPlaceholder: true }>

const isLiveWalletConnectWallet = (
	wallet: PolkadotWallet | WalletConnectWallet
): wallet is LiveWalletConnectWallet => isWalletConnectWallet(wallet) && !wallet.isPlaceholder

export const [useWalletConnectWallet, walletConnectWallet$] = bind(
	kheopskit$.pipe(map(({ wallets }) => wallets.find(isLiveWalletConnectWallet))),
	undefined
)
