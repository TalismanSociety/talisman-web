import { 
  useEffect,
  useState
} from 'react'
import { 
  uniq, 
  filter,
  orderBy,
  upperFirst
} from 'lodash'
import { useCrowdloans } from '@libs/talisman'

export const useFilter = () => {

  const orderOptions = {
    raised_desc: 'Raised',
    //raised_asc: 'Least Raised',
    id_acs: 'Oldest',
    id_desc: 'Newest',
    name_asc: 'A-Z',
    name_desc: 'Z-A',
    //ending_desc: '↓ Ending',
    //ending_asc: '↑ Ending',
  }

  const { items, status: crowdloanStatus, message } = useCrowdloans()
  const [filteredItems, setFilteredItems] = useState([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState(Object.keys(orderOptions)[0])
  const [statusOptions, setStatusOptions] = useState({})
  const [status, setStatus] = useState('__ALL__')

  // derive all unique statuses (stati? who knows? if not, it should be)
  useEffect(() => {
    const uniqstatus = {
      '__ALL__': 'All'
    }
    uniq(items.map(item => item?.crowdloan?.status||'UNKNOWN')).forEach(s => uniqstatus[s.toLowerCase()] = upperFirst(s.toLowerCase()))
    setStatusOptions(uniqstatus)
  }, [items]) // eslint-disable-line 

  // do searchy/filtery stuff here
  useEffect(() => {
    if(items.length <= 0) return

    const byStatus = status === '__ALL__'
      ? items
      : filter(items, ({crowdloan}) => crowdloan?.status?.toLowerCase() === status?.toLowerCase()) // filter

    // filter by name
    const bySearch = search !== ''
      ? filter(byStatus, ({name}) => name.toLowerCase().includes(search.toLowerCase()))
      : byStatus

    // order by 
    const orderParams = order.split('_')
    const byOrder = orderBy(bySearch, [orderParams[0]], [orderParams[1]])


    setFilteredItems(byOrder)
  }, [items, search, order, status]) // eslint-disable-line 

  return {
    items: filteredItems,
    status: crowdloanStatus,
    message,
    count: {
      total: items.length,
      filtered: filteredItems.length
    },
    filterProps: {
      search,
      order,
      status,
      setSearch, 
      setOrder,
      setStatus,
      orderOptions,
      statusOptions,
      // todo: allow resetting
      hasFilter: status !== '__ALL__' || search !== '',
      reset: () => {
        setSearch('')
        setStatus('__ALL__')
      }
    }
  }
}