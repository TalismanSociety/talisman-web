import { useRecoilValue, waitForAll } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'
import {
  connectedSubstrateWalletIdState,
  connectedSubstrateWalletState,
  useSubstrateExtensionEffect,
} from './substrate'
import { connectedEip6963RdnsState, useEvmExtensionEffect } from './evm'

export const ExtensionWatcher = () => {
  useSubstrateExtensionEffect()
  useEvmExtensionEffect()

  return null
}

export const useHadPreviouslyConnectedWallet = () => {
  return useRecoilValue(waitForAll([connectedSubstrateWalletIdState, connectedEip6963RdnsState])).some(
    x => x !== undefined
  )
}

export const useHasActiveWalletConnection = () => {
  const evmConnected = useWagmiAccount().isConnected
  return useRecoilValue(connectedSubstrateWalletState) !== undefined || evmConnected
}
