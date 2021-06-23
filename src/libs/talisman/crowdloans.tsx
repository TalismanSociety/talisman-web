import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { find } from 'lodash'
import { useStatus } from './util/hooks'
import { useApi } from '@libs/talisman'

const supplementaryConfig = {
  2000: {
    name: 'Karura',
    slug: 'karura',
    subtitle: 'Karura subtitle',
    info: 'Karura info text',
    url: 'https://acala.network/karura/join-karura',
    icon: 'https://polkadot.js.org/apps/static/karura.cb78f2cd.svg',
    image: ''
  },
  2001: {
    name: 'Bitfrost',
    slug: 'bitfrost',
    subtitle: 'Bitfrost subtitle',
    info: 'Bitfrost info text',
    url: '',
    icon: '',
    image: ''
  },
  2004: {
    name: 'Khala Network',
    slug: 'khala-network',
    subtitle: 'Khala Network subtitle',
    info: 'Khala Network info text',
    url: '',
    icon: '',
    image: ''
  },
  2006: {
    name: 'Darwinia Crab Redirect',
    slug: 'darwinia-crab-redirect',
    subtitle: 'Darwinia Crab Redirect subtitle',
    info: 'Darwinia Crab Redirect info text',
    url: '',
    icon: '',
    image: ''
  },
  2007: {
    name: 'Shiden',
    slug: 'shiden',
    subtitle: 'Shiden subtitle',
    info: 'Shiden info text',
    url: '',
    icon: '',
    image: ''
  },
  2008: {
    name: 'Mars',
    slug: 'mars',
    subtitle: 'Mars subtitle',
    info: 'Mars info text',
    url: '',
    icon: '',
    image: ''
  },
  2009: {
    name: 'PolkaSmith by PolkaFoundry',
    slug: 'polkasmith-by-polkafoundry',
    subtitle: 'PolkaSmith by PolkaFoundry subtitle',
    info: 'PolkaSmith by PolkaFoundry info text',
    url: '',
    icon: '',
    image: ''
  },
  2012: {
    name: 'Crust Shadow',
    slug: 'crust-shadow',
    subtitle: 'Crust Shadow subtitle',
    info: 'Crust Shadow info text',
    url: '',
    icon: '',
    image: ''
  },
  2016: {
    name: 'Sakura',
    slug: 'sakura',
    subtitle: 'Sakura subtitle',
    info: 'Sakura info text',
    url: '',
    icon: '',
    image: ''
  },
  2018: {
    name: 'SubGame Gamma',
    slug: 'subgame-gamma',
    subtitle: 'SubGame Gamma subtitle',
    info: 'SubGame Gamma info text',
    url: '',
    icon: '',
    image: ''
  },
  2023: {
    name: 'Moonriver',
    slug: 'moonriver',
    subtitle: 'Moonriver subtitle',
    info: 'Moonriver info text',
    url: 'https://moonbeam.foundation/moonriver-crowdloan/',
    icon: 'https://polkadot.js.org/apps/static/moonriver.0d6c0ca2.svg',
    image: ''
  },
  2024: {
    name: 'Genshiro',
    slug: 'genshiro',
    subtitle: 'Genshiro subtitle',
    info: 'Genshiro info text',
    url: '',
    icon: '',
    image: ''
  },
}

const Context = createContext({});

const useCrowdloans = () => useContext(Context)

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
          const supplementaryInfo = supplementaryConfig[id]

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
  useCrowdloanBySlug
}

export default Crowdloan