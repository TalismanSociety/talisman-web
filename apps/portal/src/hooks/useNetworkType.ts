import { useNetworksById } from '@talismn/balances-react'
import { Network, NetworkList } from '@talismn/chaindata-provider'
import { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

/** NOTE: This is a copy of https://github.com/TalismanSociety/talisman/blob/601f5581f08606dd7ab7b1e3358e7f6fe11db12a/apps/extension/src/ui/state/networks.ts#L10 */
export const getNetworkType = (network: Network, networksById: NetworkList, t: TFunction) => {
  // use name that describes the network type
  if (network.platform === 'ethereum') return t('Ethereum Blockchain')

  if (network.platform === 'polkadot') {
    if (network.topology.type === 'relay') return t('Relay Chain')

    if (network.topology.type === 'parachain') {
      const relay = networksById[network.topology.relayId]
      return relay?.name ? t('{{name}} Parachain', { name: relay.name }) : t('Parachain')
    }

    return t('Polkadot-SDK Blockchain')
  }

  return t('Blockchain')
}

export const useNetworkType = (network?: Network | null) => {
  const { t } = useTranslation()
  const networksById = useNetworksById()

  return useMemo(() => (network ? getNetworkType(network, networksById, t) : ''), [network, networksById, t])
}
