import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { find } from 'lodash'
import { useStatus } from './util/hooks'
import { useApi } from '@libs/talisman'
import { crowdloanDetails } from './util/_config'


const Context = createContext({});

const useCrowdloans = () => useContext(Context)

const useCrowdloan = id => {
  const { items, status, message } = useContext(Context)
  const [item, setItem] = useState({})
  
  useEffect(() => {
    const _item = find(items, {id: id})
    _item && setItem(_item)
  }, [items])  // eslint-disable-line 

  return {
    ...item,
    status,
    message 
  }
}

const useCrowdloanBySlug = slug => {
  const { items, status, message } = useContext(Context)
  const [item, setItem] = useState({})
  
  useEffect(() => {
    const _item = find(items, {slug: slug})
    _item && setItem(_item)
  }, [items])  // eslint-disable-line 

  return {
    ...item,
    status,
    message 
  }
}

const Provider = 
  ({
    children
  }) => {

    const [items, setItems] = useState({})
    const api = useApi()
    const { 
      status,
      message,
      setStatus,
      options
    } = useStatus({
      status: 'PROCESSING'
    })

    const hydrateItems = async () => {
      setStatus(options.PROCESSING, 'Hydrating crowdloans')

      //https://github.com/polkadot-js/apps/blob/d00c562e70f9f499a98fb2abbaf188f6c060decb/packages/page-parachains/src/useFunds.ts#L172
      //https://github.com/polkadot-js/api/blob/711a145e1e24365b3c580304266f171d3708b7be/packages/types/src/interfaces/crowdloan/types.ts#L11
      try {
        const indexes = await api.query.crowdloan.funds.keys()
        const paraIds = indexes.map(({ args: [paraId] }) => paraId)        
        const campaigns = await api.query.crowdloan.funds.multi(paraIds);

        const _items = {}

        paraIds.forEach((paraId, i) => {
          const id = paraId.toString()
          const info = JSON.parse(campaigns[i])
          const supplementaryInfo = crowdloanDetails[id]

          _items[id] = {
            id: id,
            ...supplementaryInfo,
            ...info
          }
        })

        setItems(_items)

        setStatus(options.READY, `${Object.values(_items).length} crowdloans hydrated`)
      } catch(e) {
        // statements
        console.log(e);
      }
    }

    useEffect(() => !!api.isReady && hydrateItems(), [api.isReady]) // eslint-disable-line

    return <Context.Provider 
      value={{
        items: Object.values(items),
        status,
        message
      }}
      >
      {children}
    </Context.Provider>
  }

const Crowdloan = {
  Provider,
  useCrowdloans,
  useCrowdloan,
  useCrowdloanBySlug
}

export default Crowdloan