import { BondOption } from '../types'
import { useCombinedBittensorValidatorsData } from './useCombinedBittensorValidatorsData'

export const useHighestAprFormatted = () => {
  const apr = useHighestApr()

  return Number(apr).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

export const useHighestApr = () => {
  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()

  const highestAprValidator: BondOption = combinedValidatorsData.reduce<BondOption>(
    (acc: BondOption, curr: BondOption) =>
      Number(curr.validatorYield?.thirty_day_apy || 0) > Number(acc.validatorYield?.thirty_day_apy || 0) ? curr : acc,
    {} as BondOption
  )

  return Number(highestAprValidator.validatorYield?.thirty_day_apy || 0)
}

export const useDelegateApr = (hotkey: string | undefined) => {
  const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  const delegate = combinedValidatorsData.find(validator => validator?.poolId === hotkey)
  return Number(delegate?.validatorYield?.thirty_day_apy || 0)
}
