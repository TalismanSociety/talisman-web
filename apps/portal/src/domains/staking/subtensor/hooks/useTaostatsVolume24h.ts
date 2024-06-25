import { taostatsByChainAtomFamily } from '../atoms/taostats'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

export const useTaostatsVolume24h = (genesisHash: string) => {
  const taostats = useAtomValue(taostatsByChainAtomFamily(genesisHash))
  return parseFloat(taostats?.['24h_volume'] ?? '0.0')
}

export const useTaostatsVolume24hFormatted = (genesisHash: string) => {
  const volume24h = useTaostatsVolume24h(genesisHash)
  return useMemo(
    () =>
      Intl.NumberFormat('en', {
        style: 'currency',
        notation: 'compact',
        maximumFractionDigits: 2,
        currency: 'USD',
      }).format(volume24h),
    [volume24h]
  )
}
