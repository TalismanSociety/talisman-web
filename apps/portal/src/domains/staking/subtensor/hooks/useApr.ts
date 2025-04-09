// import { useCombinedBittensorValidatorsData } from './useCombinedBittensorValidatorsData'

export const useHighestAprFormatted = () => {
  const apr = useHighestApr()

  return Number(apr).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })
}

export const useHighestApr = () => {
  // TODO: Uncomment this when taostats provide APR data, view useGetBittensorInfiniteValidators api endpoint

  // const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  // type ValidatorData = {
  //   apr: number
  // }

  // const highestAprValidator: ValidatorData = combinedValidatorsData.reduce<ValidatorData>(
  //   (acc: ValidatorData, curr: ValidatorData) => (curr.apr > acc.apr ? curr : acc),
  //   { apr: 0 }
  // )

  const highestAprValidator = { apr: 0 }

  const { apr } = highestAprValidator ?? { apr: 0 }

  return Number(apr)
}

export const useDelegateApr = (hotkey: string | undefined) => {
  // TODO: Uncomment this when taostats provide APR data, view useGetBittensorInfiniteValidators api endpoint

  // const { combinedValidatorsData } = useCombinedBittensorValidatorsData()
  // const delegate = combinedValidatorsData.find(validator => validator?.poolId === hotkey)
  // return Number(delegate?.apr)

  return undefined
}
