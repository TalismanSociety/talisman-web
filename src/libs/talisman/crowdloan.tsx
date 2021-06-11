import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { 
  find, 
  
} from 'lodash'
import { useStatus } from './util/hooks'
import { useApi, useParachains } from '@libs/talisman'

const assetPath = require.context('./assets', true);

const Context = createContext({});

// blend the crowdloan data with the parachain data
const useCrowdloans = () => {
  const { items: crowdloans, status, message } = useContext(Context)
  const { items: parachains=[] } = useParachains(Context)

  const [items, setItems] = useState([])

  useEffect(() => {
    const _items = parachains.map(parachain => {
      const crowdloan = find(crowdloans, {id: parachain.id.toString()})||{status: 'PROCESSING'}
      return {
        ...crowdloan,
        ...parachain
      }
    })

    setItems(_items)
  }, [crowdloans, parachains])

  return {
    items,
    status,
    message 
  }
}

const useFindCrowdloan = (key, val) => {
  const { items, status, message } = useCrowdloans()
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

const useCrowdloanById = val => useFindCrowdloan('id', val) 
const useCrowdloanBySlug = val => useFindCrowdloan('slug', val) 

const useCrowdloanAggregateStats = () => {
  const { items, status, message } = useCrowdloans(Context)
  const [raised, setRaised] = useState(0)
  const [projects, setProjects] = useState(0)
  const [contributors, setContributors] = useState(0)

  useEffect(() => {
    setRaised(items.reduce((acc, {raised=0}) => acc + raised, 0))
    setProjects(items.length)
    setContributors(items.reduce((acc, {contributors=[]}) => acc + contributors.length, 0))
  }, [items])  // eslint-disable-line 

  return {
    raised,
    projects,
    contributors,
    status,
    message
  }
}

const useCrowdloanAssets = id => {
  const [assets, setAssets] = useState({})
  useEffect(() => {
    if(!id) return
    let banner = ''
    let card = ''
    let logo = ''

    try {
      banner = (assetPath(`./${id}/banner.png`))?.default
    } catch(e){}
    
    try {
      card = (assetPath(`./${id}/card.png`))?.default
    } catch(e){}
    
    try {
      logo = (assetPath(`./${id}/logo.svg`))?.default
    } catch(e){}

    setAssets({banner, card, logo})
  }, [id]) // eslint-disable-line

  return assets
}

const Provider = 
  ({
    children
  }) => {

    const [items, setItems] = useState([])
    const api = useApi()
    const { 
      status,
      message,
      setStatus,
      options
    } = useStatus({
      status: 'PROCESSING',
    })

    const parseRawCrowdloanFields = fields => {
      return {
        ...fields,
        deposit: (fields.deposit / 1e12),
        raised: (fields.raised / 1e12),
        cap: (fields.cap / 1e12),
        percentRaised: 100 / (fields.cap / 1e12) * (fields.raised / 1e12)
      }
    }

    const hydrateItems = async () => {
      setStatus(options.PROCESSING, 'Hydrating crowdloans')

      //https://github.com/polkadot-js/apps/blob/d00c562e70f9f499a98fb2abbaf188f6c060decb/packages/page-parachains/src/useFunds.ts#L172
      //https://github.com/polkadot-js/api/blob/711a145e1e24365b3c580304266f171d3708b7be/packages/types/src/interfaces/crowdloan/types.ts#L11
      try {
        const indexes = await api.query.crowdloan.funds.keys()
        const paraIds = indexes.map(({ args: [paraId] }) => paraId)        
        const campaigns = await api.query.crowdloan.funds.multi(paraIds);

        const _items = []

        paraIds.forEach((paraId, i) => {
          _items.push({
            id: paraId.toString(),
            ...parseRawCrowdloanFields(JSON.parse(campaigns[i])),
            status: options.READY
          })
        })

        setItems(_items)
        setStatus(options.READY, `${Object.values(_items).length} crowdloans hydrated`)
      } catch(e) {
        setStatus(options.ERROR, e.message)
      }
    }

    useEffect(() => !!api.isReady && hydrateItems(), [api.isReady]) // eslint-disable-line

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

const Crowdloan = {
  Provider,
  useCrowdloans,
  useCrowdloanById,
  useCrowdloanBySlug,
  useCrowdloanAggregateStats,
  useCrowdloanAssets
}

export default Crowdloan