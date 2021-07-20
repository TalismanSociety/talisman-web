import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { 
  find,
  get
} from 'lodash'
import { useQuery } from './'
import { crowdloanDetails } from './util/_config'
import { useParachains } from '@libs/talisman'


const AllCrowdloans = `
  query Parachains {
    crowdloans{
      totalCount
      nodes{
        parachain{
          paraId
        }
        cap
        raised
        status
        verifier
        firstSlot
        lastSlot
        isFinished
        wonAuctionId,
        lockExpiredBlock
      }
    }
  }
`;

const Context = createContext({});

const useCrowdloans = () => useContext(Context)

const useFindCrowdloan = (key, val) => {
  const { items } = useCrowdloans()
  const [item, setItem] = useState({})
  
  useEffect(() => {
    const _item = find(items, item => get(item, key) === val);
    !!_item && setItem(_item||{})
  }, [items, key, val])  // eslint-disable-line 

  return item
}

const useCrowdloanByParachainId = val => useFindCrowdloan('parachain.id', val) 
const useCrowdloanByParachainSlug = val => useFindCrowdloan('parachain.slug', val) 

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

const Provider = 
  ({
    children
  }) => {

    const [items, setItems] = useState([])
    const [crowdloans, setCrowdloans] = useState([]) 
    const { items: parachains } = useParachains()  

    const {
      data,
      called,
      loading,
      status,
      message
    } = useQuery(AllCrowdloans)

    // parse all fetched data
    useEffect(() => {
      if(!!called && !!data.length){
        setCrowdloans(
          data.map(
            cl => !!find(crowdloanDetails, {paraId: cl?.parachain?.paraId})
              ? {
                ...cl,
                paraId: cl.parachain.paraId,
                raised: (cl.raised / 1e12),
                cap: (cl.cap / 1e12),
                percentRaised: 100 / (cl.cap / 1e12) * (cl.raised / 1e12),
               ...(find(crowdloanDetails, {paraId: cl.parachain.paraId})||{})
              }
              : null
          ).filter(p=>p)
        )
      }
    }, [data, called])

    // we want to merge the crowdload info 
    // with the parachain info to provide
    // the full dataset to the app
    useEffect(() => {
      const _items = crowdloans.map(cl => {
        const parachain = find(parachains, {id: cl?.paraId})
        return {
          ...cl,
          parachain
        }
      })

      setItems(_items)
    }, [crowdloans, parachains])

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

const Crowdloan = {
  Provider,
  useCrowdloans,
  useCrowdloanByParachainId,
  useCrowdloanByParachainSlug,
  useCrowdloanAggregateStats,
}

export default Crowdloan