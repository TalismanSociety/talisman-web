import { useEvmExtensionEffect } from './evm'
import { connectedSubstrateWalletState, useSubstrateExtensionEffect } from './substrate'
import { useRecoilValue } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'

export const ExtensionWatcher = () => {
  useSubstrateExtensionEffect()
  useEvmExtensionEffect()

  return null
}

export const useHasActiveWalletConnection = () => {
  const evmConnected = useWagmiAccount().isConnected
  return useRecoilValue(connectedSubstrateWalletState) !== undefined || evmConnected
}
