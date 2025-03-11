import { useEffect, useState } from 'react'

import { BondOption } from '../types'
import { useGetBittensorInfiniteValidators } from './useGetBittensorInfiniteValidators'
import { useGetBittensorSupportedDelegates } from './useGetBittensorSupportedDelegates'

export const useCombinedBittensorValidatorsData = () => {
  const [validatorsData, setValidatorsData] = useState<BondOption[]>([])
  const {
    data: supportedDelegates,
    isLoading: isSupportedDelegatesLoading,
    isError: isBittensorSupportedDelegatesError,
  } = useGetBittensorSupportedDelegates()
  const {
    data: infiniteValidators,
    isLoading: isValidatorsLoading,
    isError: isInfiniteValidatorsError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetBittensorInfiniteValidators({ isEnabled: true })

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    // supportedDelegates data is mission critical for staking, and it's query is initialized with placeholder data.
    // If it's not available, do not proceed with combining bad response data.
    if (!supportedDelegates) return

    const flatInitialValidators = infiniteValidators?.pages.flatMap(page => page.data)

    const combined: BondOption[] = Object.keys(supportedDelegates).map(key => {
      const supportedDelegate = supportedDelegates?.[key]
      const validator = flatInitialValidators?.find(validator => validator?.hotkey?.ss58 === key)
      return {
        poolId: key,
        name: supportedDelegate?.name ?? '',
        apr: parseFloat(validator?.apr ?? '0'),
        totalStaked: parseFloat(validator?.stake ?? '0'),
        totalStakers: validator?.nominators ?? 0,
        hasData: !!validator,
        isError: isInfiniteValidatorsError,
      }
    })

    setValidatorsData(combined)
  }, [infiniteValidators?.pages, isInfiniteValidatorsError, supportedDelegates])

  return {
    combinedValidatorsData: validatorsData,
    isLoading: isSupportedDelegatesLoading || isValidatorsLoading || isFetchingNextPage,
    isError: isBittensorSupportedDelegatesError || isInfiniteValidatorsError,
  }
}
