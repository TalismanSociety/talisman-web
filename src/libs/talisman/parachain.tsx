import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { find } from 'lodash'
import { useStatus } from './util/hooks'
//import { useApi } from '@libs/talisman'
import { parachains } from './util/_config'

const Context = createContext({
  items: [],
  status: null,
  message: null
});

const useParachains = () => useContext(Context)

const useFindParachain = (key, val) => {
  const { items, status, message } = useContext(Context)
  const [item, setItem] = useState({})
  
  useEffect(() => {
    const findOpts = {}
    findOpts[key] = val
    const _item = find(items, findOpts);
    _item && setItem(_item)
  }, [items, key, val])  // eslint-disable-line 

  return {
    ...item,
    status,
    message 
  }
}

const useParachainById = val => useFindParachain('id', val) 
const useParachainBySlug = val => useFindParachain('slug', val) 

const Provider = 
  ({
    children
  }) => {
    const [items, setItems] = useState([])
    const { 
      status,
      message,
      setStatus,
      options
    } = useStatus({
      status: 'PROCESSING',
    })

    useEffect(() => {
      setStatus(options.PROCESSING, 'Hydrating parachains')
      setItems(parachains)
      setStatus(options.READY, `${parachains.length} crowdloans hydrated`)
    }, []) // eslint-disable-line

    return <Context.Provider 
      value={{
        items,
        status,
        message
      }}
      >
      {children}
    </Context.Provider>
  }

const Parachain = {
  Provider,
  useParachains,
  useParachainById,
  useParachainBySlug,
}

export default Parachain