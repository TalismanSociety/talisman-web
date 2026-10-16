import { useEffect } from "react"
import { useAccount as useWagmiAccount } from "wagmi"

import { useEvmExtensionEffect } from "./evm"
import { substrateWalletLifecycle$, useConnectedSubstrateWallet } from "./substrate"

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
	return useConnectedSubstrateWallet() !== undefined || evmConnected
}
