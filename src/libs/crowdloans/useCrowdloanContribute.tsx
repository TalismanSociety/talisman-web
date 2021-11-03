import { trackGoal } from '@libs/fathom'
import { relayChainsChaindata } from '@libs/talisman/util/_config'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { BalanceOf } from '@polkadot/types/interfaces'
import type { ISubmittableResult } from '@polkadot/types/types'
import type { Balance } from '@talismn/api'
import Talisman from '@talismn/api'
import { addTokensToBalances, groupBalancesByAddress, useBalances, useChain } from '@talismn/api-react-hooks'
import Chaindata from '@talismn/chaindata-js'
import { Deferred, addBigNumbers, planckToTokens, tokensToPlanck, useFuncMemo } from '@talismn/util'
import customRpcs from '@util/customRpcs'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { MemberType, TaggedUnion, makeTaggedUnion, none } from 'safety-match'

//
// TODO: Move tx handling into a generic queue, store queue in react context
//

//
// Types
//

// ContributeState represents the current state of the contribution modal
export const ContributeState = makeTaggedUnion({
  Uninitialized: none,
  Initializing: (props: InitializeProps) => props,
  NoRpcsForRelayChain: none,
  NoChaindataForRelayChain: none,
  IpBanned: none,
  NeedSignature: (props: SignatureProps) => props,
  ProcessingSignature: (props: SignatureProps) => props,
  Ready: (props: ReadyProps) => props,
  ValidatingContribution: none,
  SubmittingContribution: none,
  ContributionSubmitting: (props: ContributionSubmittingProps) => props,
  ContributionSuccess: (props: ContributionSuccessProps) => props,
  ContributionFailed: (props: ContributionFailedProps) => props,
})
export type ContributeState = MemberType<typeof ContributeState> // eslint-disable-line @typescript-eslint/no-redeclare
export type ContributeStateVariant = keyof typeof ContributeState

// ContributeEvent represents the events which can be externally triggered in order to progress to the next ContributeState
export const ContributeEvent = makeTaggedUnion({
  initialize: (props: InitializeProps) => props,
  // TODO: Implement
  // Sign: (props: unknown) => props,
  setApi: (api?: ApiPromise) => api,
  setContributionAmount: (contributionAmount: string) => contributionAmount,
  setAccountBalance: (balance: Balance | null) => balance,
  // TODO: Implement
  contribute: none,
})
export type ContributeEvent = MemberType<typeof ContributeEvent> // eslint-disable-line @typescript-eslint/no-redeclare

// The callback for dispatching ContributeEvents
// This is returned from the useCrowdloanContribute hook
export type DispatchContributeEvent = (event: ContributeEvent) => void

// All of the types of props which are passed to the various state constructors
type InitializeProps = {
  relayChainId: number
  parachainId: number
}
type SignatureProps = {
  // TODO: Implement
}
type ReadyProps = {
  relayChainId: number
  parachainId: number
  nativeToken: string
  tokenDecimals: number
  rpcs: string[]
  contributionAmount: string
  api?: ApiPromise
  account?: string
  accountBalance?: Balance | null
  signature?: string
  txFee?: string
  validationError?: { i18nCode: string; vars: { [key: string]: any } }
}
type ContributionSubmittingProps = {
  explorerUrl?: string
}
type ContributionSuccessProps = {
  explorerUrl: string
}
type ContributionFailedProps = {
  explorerUrl: string
  error: string
}

//
// Hooks (exported)
//

export function useCrowdloanContribute(): [ContributeState, DispatchContributeEvent] {
  //
  // set up the state
  //
  const [state, setState] = useState<ContributeState>(ContributeState.Uninitialized)

  //
  // set up the event dispatcher
  // (used by the UI to trigger events)
  //
  const dispatch = useCallback(async (event: ContributeEvent): Promise<void> => {
    try {
      // get current state
      const state: ContributeState = await new Promise(resolve =>
        setState(currentState => {
          resolve(currentState)
          return currentState
        })
      )

      // call contributeEventReducer with current state and event
      const newState = await contributeEventReducer(state, event)

      // set new state
      setState(newState)
    } catch (error) {
      // log reducer errors
      console.error('contributeEventReducer failed', error)
    }
  }, [])

  // set up the thunk dependencies
  //
  // this is where we create an instance of the api for states which need to use it inside the thunk reducer
  // these dependencies are something of a pragmatic departure from our finite state machine architecture
  //
  // by creating and storing them here (outside of the state) we can make use of two useful properties:
  // 1. we don't need to try and serialize/deserialize them when persisting the state to localStorage
  // 2. we don't need to worry about how they're handed between multiple states which use the same dependency
  //    e.g. for the api, we want to share the one api instance between the Ready and SubmittingContribution states
  // const [thunkDependencies, setThunkDependencies] = useState({})
  // const api = useThunkDependency<ContributeState, ApiPromise>(
  //   state,
  //   // setup func
  //   async (dependency, state) => {
  //     if (dependency !== null) return dependency

  //     return await state.match({
  //       Ready: async ({ rpcs }) => {
  //         return await ApiPromise.create({ provider: new WsProvider(rpcs) })
  //       },
  //       _: () => dependency,
  //     })
  //   },
  //   // cleanup func
  //   dependency => dependency.disconnect()
  // )

  useApiDispatcher(state, dispatch)
  useAccountBalanceDispatcher(state, dispatch)

  // useThunkDependency<ContributeState, () => void>(
  //   state,
  //   async (dependency, state) =>
  //     state.match({
  //       Ready: props => {
  //         const chainIds = [props.relayChainId.toString()]
  //         const addresses = props.account ? [props.account] : []

  //         console.log('setting up balance checker')

  //         const unsubscribe = Talisman.init({ type: 'TALISMANCONNECT', rpcs: customRpcs }).subscribeBalances(
  //           chainIds,
  //           addresses,
  //           balance => dispatch(ContributeEvent.setAccountBalance(balance))
  //         )
  //         return unsubscribe
  //       },
  //       _: () => dependency,
  //     }),
  //   unsubscribe => unsubscribe()
  // )
  // const addresses = useMemo(
  //   () => state.match({ Ready: props => (props.account ? [props.account] : []), _: () => [] }),
  //   [state]
  // )
  // const chainIds = useMemo(() => state.match({ Ready: props => [props.relayChainId.toString()], _: () => [] }), [state])
  // const { balances } = useBalances(addresses, chainIds, customRpcs)
  // useEffect(() => {

  // }, [])

  // const dependencies = useMemo(() => ({ api }), [api])

  //
  // set up the thunk dispatcher
  // (used internally to create and respond to side effects)
  //
  useEffect(() => {
    stateThunkReducer(state, /*dependencies, */ setState).catch(error =>
      console.error('stateThunkReducer failed', error)
    )
  }, [state, /*dependencies, */ setState])

  return [state, dispatch]
}

//
// Reducers
//

// the event reducer
//
// it receives the current state and an event
// it then returns the new state
async function contributeEventReducer(state: ContributeState, event: ContributeEvent): Promise<ContributeState> {
  return event.match({
    initialize: props =>
      state.match({
        Uninitialized: () => ContributeState.Initializing(props),

        _: () => {
          console.error('Ignoring ContributeEvent.initialize: ContributeState is already initialized')
          return state
        },
      }),

    setApi: (api?: ApiPromise) =>
      state.match({
        Ready: props => {
          if (props.api) props.api.disconnect()
          return ContributeState.Ready({ ...props, api })
        },
        _: () => {
          console.warn('Ignoring setApi')
          throw new Error('Ignoring setApi')
        },
      }),

    setContributionAmount: (contributionAmount: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({ ...props, contributionAmount: filterContributionAmount(contributionAmount) }),

        _: () => {
          console.warn('Ignoring setContributionAmount')
          throw new Error('Ignoring setContributionAmount')
        },
      }),

    setAccountBalance: (balance: Balance | null) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({ ...props, accountBalance: addTokensToBalances([balance], props.tokenDecimals)[0] }),
        _: () => {
          console.warn('Ignoring setAccountBalance')
          throw new Error('Ignoring setAccountBalance')
        },
      }),

    // TODO: Implement
    contribute: () => {
      throw new Error('not implemented')
    },
  })
}

// the thunk reducer
//
// it receives the latest state and a setState dispatcher
// it then calls side-effects and updates the state when necessary
async function stateThunkReducer(
  state: ContributeState,
  // dependencies: { api: ApiPromise | null },
  setState: React.Dispatch<React.SetStateAction<ContributeState>>
): Promise<void> {
  await state.match({
    Initializing: async ({ relayChainId, parachainId }) => {
      console.log('Initializing', relayChainId, parachainId)

      // START: DEBUG MOONBEAM
      relayChainId = 0
      parachainId = 2001
      const rpcs = ['wss://wss.polkatrain.moonbeam.network']
      // END: DEBUG MOONBEAM

      const chaindata = await Chaindata.chain(relayChainId)
      const relayChaindata = relayChainsChaindata.find(chaindata => chaindata.id === relayChainId)
      const relayChainCustomRpcs = customRpcs[relayChainId.toString()]

      // const rpcs = relayChainCustomRpcs.length > 0 ? relayChainCustomRpcs : chaindata?.rpcs || []
      const hasRpcs = rpcs.length > 0
      if (!hasRpcs) return setState(ContributeState.NoRpcsForRelayChain)

      const { nativeToken, tokenDecimals } = chaindata
      if (!nativeToken) return setState(ContributeState.NoChaindataForRelayChain)
      if (!tokenDecimals) return setState(ContributeState.NoChaindataForRelayChain)

      setState(
        ContributeState.Ready({ relayChainId, parachainId, nativeToken, tokenDecimals, rpcs, contributionAmount: '0' })
      )
    },

    Ready: props => {
      console.log('READY')

      // // connect to api
      // if (!props.connecting) {
      //   setState(ContributeState.Ready({ ...props, connecting: true }))
      //   ApiPromise.create({ provider: new WsProvider(props.rpcs) }).then(api => {
      //     setState(state =>
      //       state.match({
      //         Ready: ({ connecting, ...props }) => ContributeState.ReadyWithApi({ ...props, api }),
      //         _: () => {
      //           api.disconnect()
      //           return state
      //         },
      //       })
      //     )
      //   })
      // }
    },
    // ReadyWithApi: props => {
    //   console.log('READY WITH API')
    // },

    _: debug => console.log({ debug }),
  })
}

// const balanceError = 'Account balance too low'

// const chainIds = useMemo(() => [relayChainId.toString()], [relayChainId])
// const addresses = useMemo(() => (account ? [account] : []), [account])

// const { nativeToken, tokenDecimals } = chaindata
// const { balances } = useBalances(addresses, chainIds, customRpcs)

// const tokenBalances = useFuncMemo(addTokensToBalances, balances, nativeToken ? tokenDecimals : undefined)
// const tokenBalancesByAddress = useFuncMemo(groupBalancesByAddress, tokenBalances)
// const tokenBalance = useMemo(() => {
//   if (!account) return undefined
//   return (tokenBalancesByAddress[account] || []).map(balance => balance.tokens).reduce(addBigNumbers, undefined)
// }, [account, tokenBalancesByAddress])

// // switch from INIT to IDLE once rpcs found
// useEffect(() => {
//   if (!hasRpcs) return
//   setStatus(status => (status === 'INIT' ? 'IDLE' : status))
// }, [hasRpcs])

// // update error message as user types
// useEffect(() => {
//   const setBalanceError = () => setError(balanceError)
//   const clearBalanceError = () => setError(error => (error === balanceError ? null : error))

//   if (!contributionAmount || contributionAmount === '') return clearBalanceError()
//   if (Number.isNaN(Number(contributionAmount))) return clearBalanceError()
//   if (ksmBalance === undefined) return clearBalanceError()
//   if (new BigNumber(ksmBalance).isLessThan(new BigNumber(contributionAmount))) return setBalanceError()
//   clearBalanceError()
// }, [balanceError, contributionAmount, error, ksmBalance])

// update tx fee as user types
// useEffect(() => {
//   ;(async () => {
//     setTxFee({ loading: true })

//     const api = await apiPromise
//     if (!api.isReady) return
//     if (!contributionAmount) return setTxFee(null)
//     if (!account) return setTxFee(null)

//     txFeeLoadingRef.current += 1
//     const loadId = txFeeLoadingRef.current

//     const { tokenDecimals } = chaindata
//     const contributionPlanck = tokensToPlanck(contributionAmount, tokenDecimals)
//     const { partialFee } = await api.tx.crowdloan
//       .contribute(parachainId, contributionPlanck, signature)
//       .paymentInfo(account)
//     const feeTokens = planckToTokens(partialFee.toString(), tokenDecimals)

//     // contributionAmount has changed since we started calculating the fee
//     if (loadId !== txFeeLoadingRef.current) return

//     setTxFee({ fee: feeTokens, loading: false })
//   })()
// }, [account, apiPromise, chaindata, contributionAmount, parachainId, signature])

// const contribute = useCallback(async () => {
//   if (status !== 'IDLE') return

//   if (!parachainId) {
//     setError(t('A parachain must be selected'))
//     return
//   }
//   if (!contributionAmount || contributionAmount.length < 1) {
//     setError(t('Please enter an amount of KSM'))
//     return
//   }
//   if (Number.isNaN(Number(contributionAmount))) {
//     setError(t('Please enter a valid amount of KSM'))
//     return
//   }
//   if (!account || account.length < 1) {
//     setError(t('An account must be selected'))
//     return
//   }

//   setError(null)
//   setExplorerUrl(null)
//   setStatus('VALIDATING')

//   const api = await apiPromise
//   let txStatus
//   try {
//     const minContribution = api.consts.crowdloan.minContribution as BalanceOf
//     const { tokenDecimals } = chaindata
//     const contributionPlanck = tokensToPlanck(contributionAmount, tokenDecimals)

//     if (!ksmBalance) {
//       setStatus('IDLE')
//       setError(t('Account balance not ready yet'))
//       return
//     }
//     if (new BigNumber(ksmBalance).isLessThan(new BigNumber(contributionAmount))) {
//       setStatus('IDLE')
//       setError(t('Account balance too low'))
//       return
//     }

//     // TODO: Test that contribution is above the minContribution
//     // TODO: Test that contribution doesn't go above crowdloan cap
//     // TODO: Test that crowdloan has not ended
//     // TODO: Test that crowdloan is in a valid lease period
//     // TODO: Test that crowdloan has not already won
//     // TODO: Validate validator signature
//     // TODO: Test user has enough KSM to not go below the existential deposit
//     // https://github.com/paritytech/polkadot/blob/dee1484760aedfd699e764f2b7c7d85855f7b077/runtime/common/src/crowdloan.rs#L432

//     if (
//       !contributionPlanck ||
//       new BigNumber(contributionPlanck).isLessThan(new BigNumber(minContribution.toString()))
//     ) {
//       setStatus('IDLE')
//       const minimum = new BigNumber(planckToTokens(minContribution.toString(), tokenDecimals) || '').toFixed(2)
//       setError(t(`A minimum of {minimum} KSM is required`, { minimum }))
//       return
//     }

//     const injector = await web3FromAddress(account)

//     const deferred = Deferred<Status>()

//     const txs = [
//       api.tx.crowdloan.contribute(parachainId, contributionPlanck, signature),
//       api.tx.system.remarkWithEvent('Crowdloan contribution submitted via the Talisman dashboard'),
//     ]

//     const tx = api.tx.utility.batchAll(txs)

//     // TODO: Show fee in UI
//     const { partialFee, weight } = await tx.paymentInfo(account)
//     console.log(`transaction will have a weight of ${weight}, with ${partialFee.toHuman()} weight fees`)

//     const txSigned = await tx.signAsync(account, { signer: injector.signer })

//     setStatus('PROCESSING')

//     const unsub = await txSigned.send(async result => {
//       const { status, events = [], dispatchError } = result

//       // TODO: Get transaction hash / unique identifier instead of block hash
//       // NOTE: Two transactions can both have the same hash
//       // To correctly identify a single transation one should use the blockNum and transaction index
//       // For more info: https://wiki.polkadot.network/docs/build-protocol-info#unique-identifiers-for-extrinsics

//       for (const {
//         phase,
//         event: { data, method, section },
//       } of events) {
//         console.info(`\t${phase}: ${section}.${method}:: ${data}`)
//       }

//       if (status.isInBlock) {
//         console.info(`Transaction included at blockHash ${status.asInBlock}`)

//         setExplorerUrl((await deriveExplorerUrl(api, result)) || null)
//       }
//       if (status.isFinalized) {
//         console.info(`Transaction finalized at blockHash ${status.asFinalized}`)
//         unsub()

//         let txStatus: Status = 'FAILED'
//         if (
//           events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess') &&
//           !events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed')
//         ) {
//           txStatus = 'SUCCESS'
//         }

//         setExplorerUrl((await deriveExplorerUrl(api, result)) || null)

//         // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
//         if (dispatchError && dispatchError.isModule && api) {
//           const decoded = api.registry.findMetaError(dispatchError.asModule)
//           const { docs, name, section } = decoded
//           setError(`${section}.${name}: ${docs.join(' ')}`)
//         } else if (dispatchError) {
//           setError(dispatchError.toString())
//         }

//         deferred.resolve(txStatus)
//       }
//     })

//     txStatus = await deferred.promise
//   } catch (error) {
//     setStatus('IDLE')

//     if (typeof error?.message === 'string' && error.message.startsWith('1010:')) {
//       setError(t('Failed to submit transaction: account balance too low'))
//       return
//     }
//
//     console.error('Failed to submit transaction', error)
//     setError(t('Failed to submit transaction'))
//     return
//   }
//
//   const { tokenDecimals } = chaindata
//   const contributionPlanck = tokensToPlanck(contributionAmount, tokenDecimals)
//   trackGoal('GTVDUALL', 1) // crowdloan_contribute
//   trackGoal('WQGRJ9OC', parseInt(contributionPlanck, 10)) // crowdloan_contribute_amount
//
//   setStatus(txStatus)
// }, [account, apiPromise, chaindata, contributionAmount, ksmBalance, parachainId, signature, status, t])

// return { contribute, status, explorerUrl, txFee, error }

//
// Hooks (internal)
//

function useApiDispatcher(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({ rpcs }) => ({ rpcs }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { rpcs } = stateDeps

    console.log('setting up api', rpcs)

    let shouldDisconnect = false

    ApiPromise.create({ provider: new WsProvider(rpcs) }).then(api => {
      if (shouldDisconnect) return api.disconnect()
      dispatch(ContributeEvent.setApi(api))
    })

    return () => {
      shouldDisconnect = true
      dispatch(ContributeEvent.setApi())
    }
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useAccountBalanceDispatcher(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({ relayChainId, account }) => ({ relayChainId, account }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { relayChainId, account } = stateDeps

    if (!account) return

    const chainIds = [relayChainId.toString()]
    const addresses = account ? [account] : []

    console.log('setting up balance checker', chainIds, addresses)

    const unsubscribe = Talisman.init({ type: 'TALISMANCONNECT', rpcs: customRpcs }).subscribeBalances(
      chainIds,
      addresses,
      balance => dispatch(ContributeEvent.setAccountBalance(balance))
    )

    return unsubscribe
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

// function useThunkDependency<TState, TDependency>(
//   state: TState,
//   deriveDependency: (dependency: TDependency | null, state: TState) => Promise<TDependency | null>,
//   cleanupDependency: (dependency: TDependency) => any
// ) {
//   const [dependency, setDependency] = useState<TDependency | null>(null)

//   useEffect(() => {
//     let cancelled = false
//     let newDependency: TDependency | null = null
//     const cleanup = () => {
//       // don't clean up when no dependency
//       if (newDependency === null) return

//       // don't clean up when dependency hasn't changed
//       if (newDependency === dependency) return

//       // clean up
//       setDependency(null)
//       cleanupDependency(newDependency)
//     }

//     ;(async () => {
//       // derive new dependency
//       newDependency = await deriveDependency(dependency, state)

//       // clean up if useEffect was unmounted
//       if (cancelled) return cleanup()

//       // set new dependency
//       setDependency(newDependency)
//     })()

//     return () => {
//       cancelled = true
//       cleanup()
//     }
//   }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

//   // clean up dependency on unmount
//   useEffect(() => () => dependency !== null && cleanupDependency(dependency), []) // eslint-disable-line react-hooks/exhaustive-deps

//   return dependency
// }

// // api is either null or ApiPromise, the promise variation of the polkadotjs api
// // apiPromise is a Promise<ApiPromise> which can be `await`ed to wait until the ApiPromise has been initialized
// function useApi(rpcs?: string[]): [ApiPromise | null, Promise<ApiPromise>] {
//   const [apiPromise, setApiPromise] = useState<Promise<ApiPromise> | null>(null)
//   const [api, setApi] = useState<ApiPromise | null>(null)
//   const [apiDeferred, setApiDeferred] = useState(Deferred<ApiPromise>())

//   useEffect(() => {
//     if (!Array.isArray(rpcs) || rpcs.length < 1) return

//     setApiPromise(ApiPromise.create({ provider: new WsProvider(rpcs) }))
//     return () => {
//       // remove apiPromise
//       setApiPromise(null)
//       // reset deferred so users don't await on a disconnected apiPromise
//       setApiDeferred(Deferred())
//     }
//   }, [rpcs])

//   useEffect(() => {
//     if (!apiPromise) return

//     apiPromise.then(api =>
//       // check that we are the most recent api promise
//       setApiPromise(currentApiPromise => {
//         // set api
//         if (apiPromise === currentApiPromise) setApi(api)
//         return currentApiPromise
//       })
//     )

//     return () => {
//       apiPromise.then(api => api.disconnect())
//     }
//   }, [apiPromise])

//   useEffect(() => {
//     if (!api) return

//     setApiDeferred(apiDeferred => {
//       // use existing deferred if still pending, otherwise create new deferred
//       const deferred = apiDeferred.isPending() ? apiDeferred : Deferred<ApiPromise>()

//       // resolve with api
//       deferred.resolve(api)

//       return deferred
//     })

//     return () => setApiDeferred(Deferred())
//   }, [api])

//   return [api, apiDeferred.promise]
// }

//
// Helpers (internal)
//

const filterContributionAmount = (contributionAmount: string): string =>
  contributionAmount
    // remove anything which isn't a number or a decimal point
    .replace(/[^.\d]/g, '')
    // remove any decimal points after the first decimal point
    .replace(/\./g, (match: string, offset: number, string: string) =>
      match === '.' ? (string.indexOf('.') === offset ? '.' : '') : ''
    )

async function deriveExplorerUrl(
  api: ApiPromise,
  result: ISubmittableResult,
  subscanUrl: string
): Promise<string | undefined> {
  const { status, events = [] } = result

  //
  // Step 1: Get block number
  //

  const blockHash = status.isFinalized
    ? status.asFinalized.toHex()
    : status.isInBlock
    ? status.asInBlock.toHex()
    : undefined

  // extrinsic has not yet been included in a block, so we cannot yet derive an explorer url
  if (blockHash === undefined) return

  const { block } = await api.rpc.chain.getBlock(blockHash)
  const blockNumber = block.header.number.toNumber()

  //
  // Step 2: Get extrinsic index in block
  //

  const txStatusEvent = events.find(
    ({ event: { method, section } }) => section === 'system' && ['ExtrinsicSuccess', 'ExtrinsicFailed'].includes(method)
  )
  if (!txStatusEvent)
    console.error(
      'Failed to find the extrinsic status event. If you see this error, there is likely a bug in the Talisman codebase. Please report it to the Talisman team for investigation.'
    )

  const txIndex = txStatusEvent?.phase.isApplyExtrinsic ? txStatusEvent.phase.asApplyExtrinsic : undefined
  if (txIndex === undefined)
    console.error(
      'Failed to derive the extrinsic index. If you see this error, there is likely a bug in the Talisman codebase. Please report it to the Talisman team for investigation.'
    )

  //
  // Step 3: Concatenate
  //

  const txId = blockNumber && txIndex !== undefined ? `${blockNumber}-${txIndex}` : undefined
  const explorerUrl = txId ? `${subscanUrl}/extrinsic/${txId}` : `${subscanUrl}/block/${blockHash}`

  return explorerUrl
}

// function stateIsVariant<TV, TState extends TaggedUnion<TV>>(state: TState, variant: string) {
//   return state.match({
//     [variant]: props => props,
//     _: () => false
//   })
// }

// function useStateProps(state: ContributeState, variant: ContributeStateVariant, props: string[]) {
//   return useMemo(() => {
//     state.match({
//       [variant]: props => {
//         const ret = {}
//         for (const prop of props) {
//           ret[prop] = props[prop]
//         }
//         return ret
//       },
//       _: () => false,
//     })
//   }, [state.variant, ...props.map(prop => state.data[prop])])
// }
