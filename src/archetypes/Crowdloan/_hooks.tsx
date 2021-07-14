import { 
  useEffect,
  useState
} from 'react'
import { 
  uniq, 
  filter,
  intersection,
  orderBy,
  flatten
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

  const { items, status, message } = useCrowdloans()
  const [filteredItems, setFilteredItems] = useState([])
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState(Object.keys(orderOptions)[0])
  const [tagOptions, setTagOptions] = useState({})
  const [showComplete, setShowComplete] = useState(false)

  // derive all unique tags
  useEffect(() => {
    // unique tags map->flatten->uniq
    const uniqtags = {}
    uniq(flatten(items.map(({tags=[]}) => tags))).forEach(tag => uniqtags[tag.toLowerCase()] = tag)
    setTagOptions(uniqtags)
  }, [items]) // eslint-disable-line 

  // do searchy/filtery stuff here
  useEffect(() => {
    if(items.length <= 0) return

    const byComplete = !showComplete
      ? filter(items, ({crowdloan}) => ['ONGOING'].includes(crowdloan?.status)) // filter
      : items // all

    // filter items by selected tags
    const byTags = tags.length > 0
      ? filter(byComplete, i => !!intersection(i?.tags, tags).length)
      : byComplete

    // filter by name
    const bySearch = search !== ''
      ? filter(byTags, ({name}) => name.toLowerCase().includes(search.toLowerCase()))
      : byTags

    // order by 
    const orderParams = order.split('_')
    const byOrder = orderBy(bySearch, [orderParams[0]], [orderParams[1]])


    setFilteredItems(byOrder)
  }, [items, tags, search, order, showComplete]) // eslint-disable-line 

  return {
    items: filteredItems,
    status,
    message,
    count: {
      total: items.length,
      filtered: filteredItems.length
    },
    filterProps: {
      tags,
      search,
      order,
      showComplete,
      setTags, 
      setSearch, 
      setOrder,
      setShowComplete,
      orderOptions,
      tagOptions,
      // todo: allow resetting
      hasFilter: tags.length > 0 || search !== '',
      reset: () => {
        setTags([])
        setSearch('')
      }
    }
  }
}