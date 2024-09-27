import { highestAprTaoValidatorAtom } from '../atoms/taostats'
import { useAtomValue } from 'jotai'

export const useApr = () => {
  // const test = useAtomValue(taostatsAtomTwo)
  // console.log({ test })
  // return useAtomValue(stakingAprByChainAtomFamily(genesisHash))
  return 123
}

export const useHighestAprFormatted = () => {
  const { apr } = useAtomValue(highestAprTaoValidatorAtom)

  return Number(apr).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}
