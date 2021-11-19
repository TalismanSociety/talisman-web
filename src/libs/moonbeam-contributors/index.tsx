import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql, useQuery } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { useModal } from '@components'
import { deriveExplorerUrl } from '@libs/crowdloans'
import { Moonbeam } from '@libs/crowdloans/crowdloanOverrides'
import { useExtension } from '@libs/talisman'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { isEthereumChecksum } from '@polkadot/util-crypto'
import { useChain } from '@talismn/api-react-hooks'
import { web3FromAddress } from '@talismn/dapp-connect'
import { Deferred } from '@talismn/util'
import { encodeAnyAddress } from '@talismn/util'
import {
  PropsWithChildren,
  useContext as _useContext,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import MoonbeamContributionModal from './Modal'
import MoonbeamContributionPopup from './Popup'

export { MoonbeamPortfolioTag } from './MoonbeamPortfolioTag'

//
// Constants
//

export const moonbeamRelaychain = SupportedRelaychains[Moonbeam.relayId]
const subqueryMoonbeamContributorsEndpoint = 'https://api.subquery.network/sq/TalismanSociety/moonbeam-contributors'

const Contributors = gql`
  query ($addresses: [String!]!) {
    contributors(filter: { id: { in: $addresses } }) {
      nodes {
        id
        rewardsAddress
        totalContributed
      }
    }
  }
`

export type Contributor = {
  id: string
  rewardsAddress: string
  totalContributed: string
}
export type ContributorWithName = Contributor & { name?: string }

//
// Hooks (exported)
//

export function useMoonbeamContributors(accounts?: string[]): {
  contributors: Contributor[]
  called: boolean
  loading: boolean
  error: any
  refetch: () => void
} {
  // memoize accounts so user can provide an array like [accountId] without wasting cycles
  const addresses = useMemo(
    () => (accounts || []).map(account => encodeAnyAddress(account, moonbeamRelaychain.id)),
    [JSON.stringify(accounts)] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const apolloClient = useContext()

  const { data, called, loading, error, refetch } = useQuery(Contributors, {
    client: apolloClient,
    variables: { addresses },
  })

  const contributors = data?.contributors?.nodes || []

  return {
    contributors,
    called,
    loading,
    error,
    refetch,
  }
}

export type SetMoonbeamRewardsAddressState =
  | { type: 'INIT'; rewardsAddress: string; error?: string }
  | { type: 'SUBMITTING'; rewardsAddress: string }
  | { type: 'FINALIZING'; explorerUrl?: string }
  | { type: 'SUCCESS'; rewardsAddress: string; explorerUrl?: string }
  | { type: 'FAILED'; error?: string; explorerUrl?: string }

export function useSetMoonbeamRewardsAddress(accountAddress?: string) {
  const [state, setState] = useState<SetMoonbeamRewardsAddressState>({ type: 'INIT', rewardsAddress: '' })

  // get api

  const { rpcs } = useChain(`${moonbeamRelaychain.id}`)
  const apiAwaitRef = useRef(Deferred<ApiPromise>())
  useEffect(() => {
    if (accountAddress === undefined) return
    if (apiAwaitRef.current.isResolved()) return
    if (!rpcs || rpcs.length < 1) return

    ApiPromise.create({ provider: new WsProvider(rpcs) }).then(api => apiAwaitRef.current.resolve(api))
  }, [accountAddress, rpcs])

  // callbacks

  const setRewardsAddress = useCallback(
    (rewardsAddress: string) => {
      if (state.type !== 'INIT') return
      setState(state => ({ ...state, rewardsAddress }))
    },
    [state.type]
  )
  const setError = useCallback(
    (error?: string) => {
      if (state.type !== 'INIT') return
      setState(state => ({ ...state, error }))
    },
    [state.type]
  )

  const send = useCallback(async () => {
    if (state.type !== 'INIT') return
    if (!accountAddress) return

    // valiate input

    const { rewardsAddress } = state
    if (!rewardsAddress || rewardsAddress.length < 1) return setError('Please enter your moonbeam rewards address')
    if (!isEthereumChecksum(rewardsAddress)) return setError('Please enter a valid moonbeam rewards address')
    setError(undefined)

    // build, sign + submit the tx

    setState({ type: 'SUBMITTING', rewardsAddress })
    const api = await apiAwaitRef.current.promise
    const tx = api.tx.crowdloan.addMemo(Moonbeam.paraId, rewardsAddress)

    try {
      const injector = await web3FromAddress(accountAddress)
      var txSigned = await tx.signAsync(accountAddress, { signer: injector.signer })
    } catch (error: any) {
      return setState({ type: 'INIT', rewardsAddress, error: error?.message || error.toString() })
    }

    try {
      const unsub = await txSigned.send(async result => {
        const { status, events = [], dispatchError } = result

        if (status.isInBlock) {
          return setState({
            type: 'FINALIZING',
            explorerUrl: await deriveExplorerUrl(api, result, moonbeamRelaychain.subscanUrl),
          })
        }

        if (status.isFinalized) {
          unsub()
          let success = false
          if (
            events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess') &&
            !events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed')
          ) {
            success = true
          }

          // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
          let error
          if (dispatchError && dispatchError.isModule && api) {
            const decoded = api.registry.findMetaError(dispatchError.asModule)
            const { docs, name, section } = decoded
            error = `${section}.${name}: ${docs.join(' ')}`
          } else if (dispatchError) {
            error = dispatchError.toString()
          }

          const explorerUrl = await deriveExplorerUrl(api, result, moonbeamRelaychain.subscanUrl)

          if (success && !error) return setState({ type: 'SUCCESS', rewardsAddress, explorerUrl })
          return setState({ type: 'FAILED', error, explorerUrl })
        }
      })
    } catch (error: any) {
      return setState({ type: 'FAILED', error: error?.message || error.toString() })
    }
  }, [accountAddress, state, setError])

  return { state, send, setRewardsAddress }
}

//
// Context
//

type ContextProps = ApolloClient<NormalizedCacheObject>

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The MoonbeamContributors provider is required in order to use this hook')

  return context
}

//
// Provider
//

export function Provider({ children }: PropsWithChildren<{}>) {
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: new BatchHttpLink({ uri: subqueryMoonbeamContributorsEndpoint, batchMax: 999, batchInterval: 20 }),
        cache: new InMemoryCache(),
      }),
    []
  )

  return <Context.Provider value={apolloClient}>{children}</Context.Provider>
}

export function PopupProvider({ children }: PropsWithChildren<{}>) {
  const { openModal } = useModal()
  const { accounts } = useExtension()
  const { contributors, loading } = useMoonbeamContributors(accounts.map(({ address }) => address))

  const [showPopup, setShowPopup] = useState(false)
  const dismissPopup = () => {
    localStorage.setItem('talisman-moonbeam-modal-dismissed', 'true')
    setShowPopup(false)
  }

  useEffect(() => {
    if (loading) return
    if (localStorage.getItem('talisman-moonbeam-modal-dismissed') === 'true') return

    const hasUnlinked = contributors.some(contributor => contributor.rewardsAddress === null)
    if (!hasUnlinked) return

    setShowPopup(true)
  }, [loading, contributors])

  return (
    <>
      {showPopup && (
        <MoonbeamContributionPopup
          openModal={() => {
            openModal(<MoonbeamContributionModal />)
            setShowPopup(false)
          }}
          dismiss={dismissPopup}
        />
      )}
      {children}
    </>
  )
}
