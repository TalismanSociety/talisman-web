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
    name_asc: 'A→Z',
    name_desc: 'Z←A',
    ending_desc: 'Ending ↓',
    ending_asc: 'Ending ↑',
    raised_desc: 'Raised ↓',
    raised_asc: 'Raised ↑',
  }

  const { items, status, message } = useCrowdloans()
  const [filteredItems, setFilteredItems] = useState([])
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState(Object.keys(orderOptions)[0])
  const [tagOptions, setTagOptions] = useState({})

  // derive all unique tags
  useEffect(() => {
    // unique tags map->flatten->uniq
    const uniqtags = {}
    uniq(flatten(items.map(({tags=[]}) => tags))).forEach(tag => uniqtags[tag.toLowerCase()] = tag)
    setTagOptions(uniqtags)
  }, [items]) // eslint-disable-line 

  // do searchy stuff here
  useEffect(() => {
    if(items.length <= 0) return

    // filter items by selected tags
    const byTags = tags.length > 0
      ? filter(items, i => !!intersection(i?.tags, tags).length)
      : items

    // filter by name
    const bySearch = search !== ''
      ? filter(byTags, ({name}) => name.toLowerCase().includes(search.toLowerCase()))
      : byTags

    // order by 
    const orderParams = order.split('_')
    const byOrder = orderBy(bySearch, [orderParams[0]], [orderParams[1]])

    setFilteredItems(byOrder)
  }, [items, tags, search, order]) // eslint-disable-line 

  return {
    items: filteredItems,
    status,
    message,
    filterProps: {
      tags,
      search,
      order,
      setTags, 
      setSearch, 
      setOrder,
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