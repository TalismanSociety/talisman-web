import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { BondOption } from '../types'
import { useGetBittensorValidators } from './useGetBittensorInfiniteValidators'
import { useGetInfiniteValidatorsYieldByNetuid } from './useGetInfiniteValidatorsYield'

export const useCombinedBittensorValidatorsData = (netuid?: number) => {
  const [validatorsData, setValidatorsData] = useState<BondOption[]>([])
  const [searchParams] = useSearchParams()
  const netuidParam = netuid ?? Number(searchParams.get('netuid'))

  const { data: validatorsYieldData, isLoading: isValidatorsYieldLoading } = useGetInfiniteValidatorsYieldByNetuid({
    netuid: netuidParam,
  })

  const {
    data: infiniteValidators,
    isLoading: isValidatorsLoading,
    isError: isInfiniteValidatorsError,
  } = useGetBittensorValidators()

  useEffect(() => {
    const combined: BondOption[] =
      infiniteValidators?.map(validator => {
        const validatorYield = validatorsYieldData?.find(
          yieldData => yieldData?.hotkey?.ss58 === validator.hotkey?.ss58
        )

        return {
          poolId: validator.hotkey?.ss58 ?? '',
          name: validator?.name ?? '',
          totalStaked: parseFloat(validator?.global_weighted_stake ?? '0'),
          totalStakers: validator?.global_nominators ?? 0,
          hasData: !!validator,
          isError: isInfiniteValidatorsError,
          validatorYield,
        }
      }) ?? []
    setValidatorsData(combined)
  }, [infiniteValidators, isInfiniteValidatorsError, validatorsYieldData])

  return {
    combinedValidatorsData: validatorsData,
    isLoading: isValidatorsLoading,
    isError: isInfiniteValidatorsError,
    isValidatorsYieldLoading,
  }
}
