import { 
  createContext, 
  useContext,
  useEffect,
  useState
} from 'react'
import { 
  useStatus, 
} from './util/hooks'
import { useApi } from '@libs/talisman'

const supplementaryConfig = {
  2023: {
    name: 'Moonriver',
    url: 'https://moonbeam.foundation/moonriver-crowdloan/',
    icon: 'https://polkadot.js.org/apps/static/moonriver.0d6c0ca2.svg',
    image: 'https://polkadot.js.org/apps/static/moonriver.0d6c0ca2.svg'
  }
}

const Context = createContext({});

const useCrowdloans = () => useContext(Context)

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
    } = useStatus()

    const hydrateItems = async () => {
      setStatus(options.PROCESSING, 'Hydrating crowdloans')
      //const aaa = await api.query.proposeParachain?.approvedProposals()
     // console.log(api.query.crowdloan)

      //const aaa = await api.query.auctions.auctionInfo()
      //console.log(aaa.toString())

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

        // const aaa = paraIds
        //       .map((paraId, i) => [paraId, null])
        //       .filter((v) => !!v[1])
        //       .map(([paraId, info]) => ({
        //         accountId: encodeAddress(createAddress(paraId)),
        //         childKey: createChildKey(info.trieIndex),
        //         firstSlot: info.firstSlot,
        //         info,
        //         isCrowdloan: true,
        //         key: paraId.toString(),
        //         lastSlot: info.lastSlot,
        //         paraId,
        //         value: info.raised
        //       }))
        //       .sort((a, b) =>
        //         a.info.end.cmp(b.info.end) ||
        //         a.info.firstSlot.cmp(b.info.firstSlot) ||
        //         a.info.lastSlot.cmp(b.info.lastSlot) ||
        //         a.paraId.cmp(b.paraId)
        //       )

        // console.log({aaa})

        // fetch all details about each parachain
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

const _guardian = {
  Provider,
  useCrowdloans
}

export default _guardian