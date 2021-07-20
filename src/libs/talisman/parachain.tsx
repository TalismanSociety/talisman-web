import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { find } from 'lodash'
import { useQuery } from './'
import { parachainDetails } from './util/_config'

const assetPath = require.context('./assets', true);

const AllParachains = `
  query Parachains {
    parachains {
      nodes{
        paraId
      }
    }
  }
`;

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

const useParachainAssets = id => {
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
    const {
      data,
      called,
      loading,
      status,
      message
    } = useQuery(AllParachains)

    useEffect(() => {
      if(!!called && !!data.length){
        setItems(
          data.map(
            ({
              paraId, 
              ...rest
            }) => {
              return !!parachainDetails[paraId]
                ? {
                  id: paraId,
                  ...(parachainDetails[paraId]||{})
                }
                : null
            }
          ).filter(p=>p)
        )
      }
    }, [data, called])

    return <Context.Provider 
      value={{
        items,
        loading,
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
  useParachainAssets
}

export default Parachain