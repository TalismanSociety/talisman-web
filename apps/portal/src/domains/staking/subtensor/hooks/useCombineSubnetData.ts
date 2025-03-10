import { useEffect, useState } from 'react'

import { type SubnetData } from '../types'
import { useGetInfiniteSubnetDescriptions } from './useGetInfiniteSubnetDescriptions'
import { useGetInfiniteSubnetPools } from './useGetInfiniteSubnetPools'

export const useCombineSubnetData = () => {
  const [subnetData, setSubnetData] = useState<Record<number, SubnetData>>({})
  const {
    data: subnetDescriptionsData,
    hasNextPage: hasSubnetDescriptionsNextPage,
    isFetchingNextPage: isSubnetDescriptionsFetchingNextPage,
    isError: isSubnetDescriptionsError,
    fetchNextPage: fetchSubnetDescriptionsNextPage,
  } = useGetInfiniteSubnetDescriptions()

  const {
    data: subnetPoolsData,
    hasNextPage: hasSubnetPoolsNextPage,
    isFetchingNextPage: isSubnetPoolsFetchingNextPage,
    isError: isSubnetPoolsError,
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

  useEffect(() => {
    if (!subnetDescriptionsData?.pages.length || !subnetPoolsData?.pages.length) return

    const descriptions = subnetDescriptionsData.pages
      .flatMap(page => page.data)
      .map(desc => ({ ...desc, descriptionName: desc.name }))
    const pools = subnetPoolsData.pages.flatMap(page => page.data)

    const combinedSubnetData = descriptions.reduce((acc, desc) => {
      const netuid = Number(desc.netuid)
      const pool = pools.find(pool => Number(pool.netuid) === netuid) || {}

      acc[netuid] = { ...desc, ...pool }
      return acc
    }, {} as Record<number, SubnetData>)

    setSubnetData(combinedSubnetData)
  }, [subnetDescriptionsData, subnetDescriptionsData?.pages, subnetPoolsData, subnetPoolsData?.pages])

  return { subnetData: subnetData, isError: isSubnetDescriptionsError || isSubnetPoolsError }
}
