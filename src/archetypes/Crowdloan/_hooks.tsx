import { useCrowdloans } from '@libs/talisman'
import { filter, find, orderBy } from 'lodash'
import { useEffect, useState } from 'react'

const orderOptions = [
  {
    key: 'raised_desc',
    value: 'Raised',
    cb: (items: any) => orderBy(items, ['raised'], ['desc']),
  },
  {
    key: 'id_asc',
    value: 'Oldest',
    cb: (items: any) => orderBy(items, ['parachain.id'], ['asc']),
  },
  {
    key: 'id_desc',
    value: 'Newest',
    cb: (items: any) => orderBy(items, ['parachain.id'], ['desc']),
  },
  {
    key: 'name_asc',
    value: 'A⇢Z',
    cb: (items: any) => orderBy(items, ['parachain.name'], ['asc']),
  },
  {
    key: 'name_desc',
    value: 'Z⇢A',
    cb: (items: any) => orderBy(items, ['parachain.name'], ['desc']),
  },
]

const statusOptions = [
  {
    key: 'all',
    value: 'All',
    cb: (items: any) => items,
  },
  // {
  //   key: 'completed',
  //   value: 'Completed',
  //   cb: items => filter(items, {status: 'Won'})
  // },
  // {
  //   key: 'active',
  //   value: 'Active',
  //   cb: items => filter(items, {status: 'Started'})
  // },
  // {
  //   key: 'retiring',
  //   value: 'Finished',
  //   cb: items => filter(items, { status: 'Retiring' }),
  // },
  // {
  //   key: 'dissolved',
  //   value: 'Dissolved',
  //   cb: items => filter(items, { status: 'Dissolved' }),
  // },
  {
    key: 'active',
    value: 'Active',
    cb: (items: any) => filter(items, item => item.status === 'active'),
  },
  {
    key: 'winner',
    value: '🎉 Winner',
    cb: (items: any) => filter(items, item => item.status === 'winner'),
  },
  {
    key: 'ended',
    value: 'Ended',
    cb: (items: any) => filter(items, item => item.status === 'ended'),
  },
]

export const useFilter = () => {
  const { items, message, hydrated } = useCrowdloans()
  const [filteredItems, setFilteredItems] = useState([])
  const [searchFilter, setSearchFilter] = useState('')
  const [orderFilter, setOrderFilter] = useState(orderOptions[0].key)
  const [statusFilter, setStatusFilter] = useState(statusOptions[1].key)
  const [loading, setLoading] = useState(true)

  // do searchy/filtery stuff
  useEffect(() => {
    if (!hydrated) return

    // filter by status
    const byStatus = find(statusOptions, { key: statusFilter })?.cb(items)

    // searching
    const bySearch =
      searchFilter !== ''
        ? filter(byStatus, ({ parachain }) => parachain?.name?.toLowerCase().includes(searchFilter.toLowerCase()))
        : byStatus

    // ordering
    const orderCallback = find(orderOptions, { key: orderFilter })?.cb
    const byOrder = !!orderCallback ? orderCallback(bySearch) : bySearch

    setFilteredItems(byOrder)
    setLoading(false)
  }, [items, searchFilter, orderFilter, statusFilter, hydrated]) // eslint-disable-line

  return {
    items: filteredItems,
    loading,
    message,
    count: {
      total: items?.length,
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
