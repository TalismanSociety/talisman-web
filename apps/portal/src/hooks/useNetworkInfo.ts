import { Chain, SimpleEvmNetwork } from '@talismn/chaindata-provider'
import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export type NetworkInfoProps = {
  chain?: Chain | null
  evmNetwork?: SimpleEvmNetwork | null
  relay?: Chain | null
}

/** NOTE: This is a copy of https://github.com/TalismanSociety/talisman/blob/fc6982ee6298f686e74ed56a82acef65aa223ad3/apps/extension/src/ui/hooks/useNetworkInfo.ts */
export const getNetworkInfo = (t: TFunction, { chain, evmNetwork, relay }: NetworkInfoProps) => {
  if (evmNetwork) {
    const label = evmNetwork.name
    return { label, type: evmNetwork.isTestnet ? t('EVM Testnet') : t('EVM Blockchain') }
  }

  if (chain) {
    const label = chain.name
    const type = (() => {
      if (chain.isTestnet) return t('Testnet')
      if (chain.paraId) {
        if (relay?.name) return t('{{name}} Parachain', { name: relay?.name })
        return t('Parachain')
      }
      return (chain.parathreads || []).length > 0 ? t('Relay Chain') : t('Blockchain')
    })()

    return { label, type }
  }

  return { label: '', type: '' }
}

export const useNetworkInfo = ({ chain, evmNetwork, relay }: NetworkInfoProps) => {
  const { t } = useTranslation()

  return useMemo(() => getNetworkInfo(t, { chain, evmNetwork, relay }), [chain, evmNetwork, relay, t])
}
