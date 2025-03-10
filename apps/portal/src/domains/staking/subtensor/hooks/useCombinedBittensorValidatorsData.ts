import { useEffect, useMemo } from 'react'

import { BondOption } from '../types'
import { useGetBittensorInfiniteValidators } from './useGetBittensorInfiniteValidators'
import { useGetBittensorSupportedDelegates } from './useGetBittensorSupportedDelegates'

export const useCombinedBittensorValidatorsData = () => {
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

  const combinedValidatorsData = useMemo(() => {
    if (
      isSupportedDelegatesLoading ||
      isFetchingNextPage ||
      isValidatorsLoading ||
      !supportedDelegates ||
      !infiniteValidators
    )
      return []

    const flatInitialValidators = infiniteValidators.pages.flatMap(page => page.data)

    const combined: BondOption[] = Object.keys(supportedDelegates).map(key => {
      const supportedDelegate = supportedDelegates[key]
      const validator = flatInitialValidators.find(validator => validator?.hotkey?.ss58 === key)
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

    return combined
  }, [
    infiniteValidators,
    isFetchingNextPage,
    isInfiniteValidatorsError,
    isSupportedDelegatesLoading,
    isValidatorsLoading,
    supportedDelegates,
  ])

  return {
    combinedValidatorsData,
    isLoading: isSupportedDelegatesLoading || isValidatorsLoading || isFetchingNextPage,
    isError: isBittensorSupportedDelegatesError || isInfiniteValidatorsError,
  }
}
