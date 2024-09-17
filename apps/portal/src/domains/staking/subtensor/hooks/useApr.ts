import { stakingAprByChainAtomFamily } from '../atoms/taostats'
import { useAtomValue } from 'jotai'

export const useApr = (genesisHash: string | undefined) => {
  return useAtomValue(stakingAprByChainAtomFamily(genesisHash))
}

export const useAprFormatted = (genesisHash: string | undefined) => {
  const apr = useApr(genesisHash)

  return apr ? apr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 }) : '--'
}
