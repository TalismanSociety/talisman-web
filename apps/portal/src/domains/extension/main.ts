import { useEffect } from "react"
import { useConnection } from "wagmi"

import { useEvmExtensionEffect } from "./evm"
import { substrateWalletLifecycle$, useHasConnectedSubstrateWallet } from "./substrate"

export const ExtensionWatcher = () => {
	useEffect(() => {
		const subscription = substrateWalletLifecycle$.subscribe()
		return () => subscription.unsubscribe()
	}, [])
	useEvmExtensionEffect()

	return null
}

export const useHasActiveWalletConnection = () => {
	const evmConnected = useConnection().isConnected
	return useHasConnectedSubstrateWallet() || evmConnected
}
