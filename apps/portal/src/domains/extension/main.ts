import { useRecoilValue } from 'recoil'
import { useAccount as useWagmiAccount } from 'wagmi'

import { useEvmExtensionEffect } from './evm'
import {
  connectedSubstrateWalletState,
  initialisedSubstrateWalletsState,
  useSubstrateExtensionEffect,
} from './substrate'

export const ExtensionWatcher = () => {
  useSubstrateExtensionEffect()
  useEvmExtensionEffect()

  return null
}

export const useHasActiveWalletConnection = () => {
  const evmConnected = useWagmiAccount().isConnected
  return useRecoilValue(connectedSubstrateWalletState) !== undefined || evmConnected
}

export const useWalletConnectionInitialised = () => useRecoilValue(initialisedSubstrateWalletsState)
