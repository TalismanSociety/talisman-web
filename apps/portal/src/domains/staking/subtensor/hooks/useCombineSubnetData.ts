import { useEffect, useMemo } from 'react'

import { type SubnetData } from '../types'
import { useGetInfiniteSubnetDescriptions } from './useGetInfiniteSubnetDescriptions'
import { useGetInfiniteSubnetPools } from './useGetInfiniteSubnetPools'

export const useCombineSubnetData = () => {
  const {
    data: subnetDescriptionsData,
    hasNextPage: hasSubnetDescriptionsNextPage,
    isFetchingNextPage: isSubnetDescriptionsFetchingNextPage,
    fetchNextPage: fetchSubnetDescriptionsNextPage,
  } = useGetInfiniteSubnetDescriptions()

  const {
    data: subnetPoolsData,
    hasNextPage: hasSubnetPoolsNextPage,
    isFetchingNextPage: isSubnetPoolsFetchingNextPage,
    fetchNextPage: fetchSubnetPoolsNextPage,
  } = useGetInfiniteSubnetPools()

  useEffect(() => {
    if (hasSubnetDescriptionsNextPage && !isSubnetDescriptionsFetchingNextPage) {
      fetchSubnetDescriptionsNextPage()
    }
  }, [hasSubnetDescriptionsNextPage, isSubnetDescriptionsFetchingNextPage, fetchSubnetDescriptionsNextPage])

  useEffect(() => {
    if (hasSubnetPoolsNextPage && !isSubnetPoolsFetchingNextPage) {
      fetchSubnetPoolsNextPage()
    }
  }, [hasSubnetPoolsNextPage, isSubnetPoolsFetchingNextPage, fetchSubnetPoolsNextPage])

  const subnetData = useMemo(() => {
    if (!subnetDescriptionsData?.pages.length || !subnetPoolsData?.pages.length) return {}

    const descriptions = subnetDescriptionsData.pages
      .flatMap(page => page.data)
      .map(desc => ({ ...desc, descriptionName: desc.name }))
    const pools = subnetPoolsData.pages.flatMap(page => page.data)

    return descriptions.reduce((acc, desc) => {
      const netuid = Number(desc.netuid)
      const pool = pools.find(pool => Number(pool.netuid) === netuid) || {}

      acc[netuid] = { ...desc, ...pool }
      return acc
    }, {} as Record<number, SubnetData>)
  }, [subnetDescriptionsData?.pages, subnetPoolsData?.pages])

  return { subnetData }
}
