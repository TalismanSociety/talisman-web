import { taostatsByChainAtomFamily } from '../atoms/taostats'
import { useAtomValue } from 'jotai'

export const useTaostatsToken = (genesisHash?: string) => {
  const taostats = useAtomValue(taostatsByChainAtomFamily(genesisHash))
  return taostats?.token
}
