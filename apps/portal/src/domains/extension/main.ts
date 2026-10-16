import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import { useAccount as useWagmiAccount } from "wagmi"

import { useEvmExtensionEffect } from "./evm"
import {
	connectedSubstrateWalletState,
	initialisedSubstrateWalletsState,
	substrateWalletLifecycle$,
} from "./substrate"

export const ExtensionWatcher = () => {
	useEffect(() => {
		const subscription = substrateWalletLifecycle$.subscribe()
		return () => subscription.unsubscribe()
	}, [])
	useEvmExtensionEffect()

	return null
}

export const useHasActiveWalletConnection = () => {
	const evmConnected = useWagmiAccount().isConnected
	return useRecoilValue(connectedSubstrateWalletState) !== undefined || evmConnected
}

export const useWalletConnectionInitialised = () => useRecoilValue(initialisedSubstrateWalletsState)
