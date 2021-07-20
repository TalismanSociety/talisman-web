import { 
  useEffect,
  useState
} from 'react'
import { 
  filter,
  find,
  orderBy
} from 'lodash'
import { useCrowdloans } from '@libs/talisman'

const orderOptions = [
  {
    key: 'raised_desc',
    value: 'Raised',
    cb: items => orderBy(items, ['raised'], ['desc'])
  },
  {
    key: 'id_acs',
    value: 'Oldest',
    cb: items => orderBy(items, ['parachain.id'], ['asc'])
  },
  {
    key: 'id_desc',
    value: 'Newest',
    cb: items => orderBy(items, ['parachain.id'], ['desc'])
  },
  {
    key: 'name_acs',
    value: 'A⇢Z',
    cb: items => orderBy(items, ['parachain.name'], ['acs'])
  },
  {
    key: 'name_desc',
    value: 'Z⇢A',
    cb: items => orderBy(items, ['parachain.name'], ['desc'])
  }
]

const statusOptions = [
  {
    key: 'all',
    value: 'All',
    cb: items => items
  },
  {
    key: 'completed',
    value: 'Completed',
    cb: items => filter(items, {status: 'Won'})
  },
  {
    key: 'active',
    value: 'Active',
    cb: items => filter(items, {status: 'Started'})
  },
]

export const useFilter = () => {

  const { items, status: crowdloanStatus, message } = useCrowdloans()
  const [filteredItems, setFilteredItems] = useState([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState(orderOptions[0].key)
  const [status, setStatus] = useState(statusOptions[0].key)

  // do searchy/filtery stuff 
  useEffect(() => {
    if(items?.length <= 0) return

    // filter by status
    const byStatus = find(statusOptions, {key: status})?.cb(items)
   
    // searching
    const bySearch = search !== ''
      ? filter(byStatus, ({parachain}) => parachain?.name?.toLowerCase().includes(search.toLowerCase()))
      : byStatus

    // ordering
    const orderCallback = find(orderOptions, {key: order})?.cb
    const byOrder = !!orderCallback ? orderCallback(bySearch) : bySearch

    setFilteredItems(byOrder)
  }, [items, status, search, order]) // eslint-disable-line 

  return {
    items: filteredItems,
    status: crowdloanStatus,
    message,
    count: {
      total: items?.length,
      filtered: filteredItems?.length
    },
    filterProps: {
      search,
      order,
      status,
      setSearch, 
      setOrder,
      setStatus,
      orderOptions: orderOptions.map(({key, value}) => ({key, value})),
      statusOptions: statusOptions.map(({key, value}) => ({key, value})),
      hasFilter: status !== '__ALL__' || search !== '',
      reset: () => {
        setSearch('')
        setStatus(statusOptions[0].key)
      }
    }
  }
}