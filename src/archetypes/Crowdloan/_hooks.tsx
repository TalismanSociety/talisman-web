import { Crowdloan, ParachainDetails, useLatestCrowdloans, useParachainsDetailsIndexedById } from '@libs/talisman'
import { filter, find, orderBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

type Item = { crowdloan: Crowdloan; parachainDetails?: ParachainDetails }

const orderOptions = [
  {
    key: 'raised_desc',
    value: 'Raised',
    cb: (items: Item[]) => orderBy(items, ['crowdloan.raised'], ['desc']),
  },
  {
    key: 'id_asc',
    value: 'Oldest',
    cb: (items: Item[]) => orderBy(items, ['crowdloan.blockNum'], ['asc']),
  },
  {
    key: 'id_desc',
    value: 'Newest',
    cb: (items: Item[]) => orderBy(items, ['crowdloan.blockNum'], ['desc']),
  },
  {
    key: 'name_asc',
    value: 'A⇢Z',
    cb: (items: Item[]) => orderBy(items, ['parachainDetails.name'], ['asc']),
  },
  {
    key: 'name_desc',
    value: 'Z⇢A',
    cb: (items: Item[]) => orderBy(items, ['parachainDetails.name'], ['desc']),
  },
]

const statusOptions = [
  {
    key: 'all',
    value: 'All',
    cb: (items: Item[]) => items,
  },
  {
    key: 'active',
    value: 'Active',
    cb: (items: Item[]) => filter(items, item => ['active', 'capped'].includes(item.crowdloan.uiStatus)),
  },
  {
    key: 'winner',
    value: '🎉 Winner',
    cb: (items: Item[]) => filter(items, item => item.crowdloan.uiStatus === 'winner'),
  },
  {
    key: 'ended',
    value: 'Ended',
    cb: (items: Item[]) => filter(items, item => item.crowdloan.uiStatus === 'ended'),
  },
]

export const useFilter = () => {
  const { crowdloans, message, hydrated } = useLatestCrowdloans()
  const { parachains } = useParachainsDetailsIndexedById()
  const items = useMemo(
    () =>
      crowdloans
        .map(crowdloan => ({ crowdloan, parachainDetails: parachains[crowdloan.parachain.paraId] }))
        .filter(({ parachainDetails }) => !!parachainDetails),
    [crowdloans, parachains]
  )

  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchFilter, setSearchFilter] = useState('')
  const [orderFilter, setOrderFilter] = useState(orderOptions[0].key)
  const [statusFilter, setStatusFilter] = useState(statusOptions[2].key)
  const [loading, setLoading] = useState(true)

  // do searchy/filtery stuff
  useEffect(() => {
    if (!hydrated) return

    // filter by status
    const byStatus = find(statusOptions, { key: statusFilter })?.cb(items) || []

    // searching
    const bySearch =
      searchFilter !== ''
        ? byStatus.filter(item => item.parachainDetails?.name.toLowerCase().includes(searchFilter.toLowerCase()))
        : byStatus

    // ordering
    const orderCallback = find(orderOptions, { key: orderFilter })?.cb
    const byOrder = !!orderCallback ? orderCallback(bySearch) : bySearch

    setFilteredItems(byOrder)
    setLoading(false)
  }, [hydrated, items, orderFilter, searchFilter, statusFilter])

  const filteredCrowdloans = useMemo(() => filteredItems.map(({ crowdloan }) => crowdloan), [filteredItems])

  return {
    crowdloans: filteredCrowdloans,
    loading,
    message,
    count: {
      total: crowdloans?.length,
      filtered: filteredItems?.length,
    },
    filterProps: {
      search: searchFilter,
      order: orderFilter,
      status: statusFilter,
      setSearch: setSearchFilter,
      setOrder: setOrderFilter,
      setStatus: setStatusFilter,
      orderOptions: orderOptions.map(({ key, value }) => ({ key, value })),
      statusOptions: statusOptions.map(({ key, value }) => ({ key, value })),
      hasFilter: statusFilter !== 'all' || searchFilter !== '',
      reset: () => {
        setSearchFilter('')
        setStatusFilter(statusOptions[0].key)
      },
    },
  }
}
