import { trackGoal } from '@libs/fathom'
import { SupportedRelaychains } from '@libs/talisman/util/_config'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { ISubmittableResult } from '@polkadot/types/types'
import type { Balance } from '@talismn/api'
import Talisman from '@talismn/api'
import type { BalanceWithTokens } from '@talismn/api-react-hooks'
import { addTokensToBalances } from '@talismn/api-react-hooks'
import Chaindata from '@talismn/chaindata-js'
import { addBigNumbers, decodeAnyAddress, encodeAnyAddress, planckToTokens, tokensToPlanck } from '@talismn/util'
import customRpcs from '@util/customRpcs'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { MemberType, makeTaggedUnion, none } from 'safety-match'
import { v4 as uuidv4 } from 'uuid'

import moonbeamStatement from './moonbeamStatement'
import { useCrowdloanContributions } from './useCrowdloanContributions'

//
// TODO: Move tx handling into a generic queue, store queue in react context
//

// TODO: Store Acala overrides somewhere neat
export const acalaOptions = {
  api: 'https://crowdloan.aca-api.network',
  relayId: 0,
  parachainId: 2000,
  referral: encodePolkadotAddressAsHexadecimalPublicKey('1564oSHxGVQEaSwHgeYKD1z1A8BXeuqL3hqBSWMA6zHmKnz1'),
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGFsaXNtYW4iLCJpYXQiOjE2MzYwNTM5NTV9.vplu8f6JI-T7SLuKwKU001KDPof04Lp6cCFyJXLWSKg',
}
export const astarOptions = {
  relayId: 0,
  parachainId: 2006,
  referral: encodePolkadotAddressAsHexadecimalPublicKey('1564oSHxGVQEaSwHgeYKD1z1A8BXeuqL3hqBSWMA6zHmKnz1'),
}
export const moonbeamOptions = {
  // prod
  api: 'https://yy9252r9jh.api.purestake.io',
  relayId: 0,
  parachainId: 2004,
  statement: moonbeamStatement,
  apiKey: 'QIOqO3FFNj1nmpmGQ0hq7aV3MMdj7r6q8N1hJBh7',

  // // test
  // api: 'https://wallet-test.api.purestake.xyz',
  // relayId: 0,
  // parachainId: 2002,
  // statement: moonbeamStatement,
  // apiKey: 'WbDaeFsMeh4BTLGqqzCe03A44w8vrwvl4lxw2WNm',
}

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
  Ready: (props: ReadyProps) => props,
  ContributionSubmitting: (props: ContributionSubmittingProps) => props,
  ContributionSuccess: (props: ContributionSuccessProps) => props,
  ContributionFailed: (props: ContributionFailedProps) => props,
})
export type ContributeState = MemberType<typeof ContributeState> // eslint-disable-line @typescript-eslint/no-redeclare
export type ContributeStateVariant = keyof typeof ContributeState

// ContributeEvent represents the events which can be externally triggered in order to progress to the next ContributeState
export const ContributeEvent = makeTaggedUnion({
  initialize: (props: InitializeProps) => props,
  _noRpcsForRelayChain: none,
  _noChaindataForRelayChain: none,
  _ipBanned: none,
  _initialized: (props: ReadyProps) => props,
  // TODO: Implement
  // Sign: (props: unknown) => props,
  _setApi: (api?: ApiPromise) => api,
  setContributionAmount: (contributionAmount: string) => contributionAmount,
  setAccount: (account?: string) => account,
  setEmail: (email?: string) => email,
  setVerifierSignature: (verifierSignature?: string) => verifierSignature,
  _setAccountBalance: (balance: BalanceWithTokens | null) => balance,
  _setValidationError: (validationError?: { i18nCode: string; vars?: { [key: string]: any } }) => validationError,
  _setTxFee: (txFee?: string | null) => txFee,
  contribute: none,
  _validateContribution: none,
  _setContributionSubmitting: (props: ContributionSubmittingProps) => props,
  _finalizedContributionSuccess: (props: ContributionSuccessProps) => props,
  _finalizedContributionFailed: (props: ContributionFailedProps) => props,
})
export type ContributeEvent = MemberType<typeof ContributeEvent> // eslint-disable-line @typescript-eslint/no-redeclare

// The callback for dispatching ContributeEvents
// This is returned from the useCrowdloanContribute hook
export type DispatchContributeEvent = (event: ContributeEvent) => void

// All of the types of props which are passed to the various state constructors
type InitializeProps = {
  crowdloanId: string
  relayChainId: number
  parachainId: number
}
type SignatureProps = {
  // TODO: Implement
}
type ReadyProps = {
  crowdloanId: string
  relayChainId: number
  relayNativeToken: string
  relayTokenDecimals: number
  relayRpcs: string[]
  parachainId: number
  parachainName?: string
  subscanUrl?: string

  contributionAmount: string
  account?: string
  email?: string
  verifierSignature?: string

  api?: ApiPromise
  accountBalance?: BalanceWithTokens | null
  txFee?: string | null
  validationError?: { i18nCode: string; vars?: { [key: string]: any } }
  submissionRequested: boolean
  submissionValidated: boolean
}
type ContributionSubmittingProps = {
  explorerUrl?: string
}
type ContributionSuccessProps = {
  explorerUrl?: string
}
type ContributionFailedProps = {
  explorerUrl?: string
  error?: string
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
  const dispatch = useCallback((event: ContributeEvent) => setState(state => contributeEventReducer(state, event)), [])

  //
  // set up state thunks
  // used to asynchronously react to state changes, fire off side effects and dispatch further ContributeEvents
  //
  useInitializeThunk(state, dispatch)
  useApiThunk(state, dispatch)
  useAccountBalanceThunk(state, dispatch)
  useValidateAccountHasContributionBalanceThunk(state, dispatch)
  useTxFeeThunk(state, dispatch)
  useMoonbeamThunk(state, dispatch)
  useValidateContributionThunk(state, dispatch)
  useSignAndSendContributionThunk(state, dispatch)

  return [state, dispatch]
}

//
// Reducers
//

// the event reducer
//
// it receives the current state and an event
// it then returns the new state
function contributeEventReducer(state: ContributeState, event: ContributeEvent): ContributeState {
  if (process.env.NODE_ENV === 'development')
    console.log(`Dispatching event ${event.variant} with data ${JSON.stringify(event.data, null, 2)}`)

  return event.match({
    initialize: props =>
      state.match({
        Uninitialized: () => ContributeState.Initializing(props),
        _: () => {
          console.warn('Ignoring ContributeEvent.initialize: ContributeState is already initialized')
          return state
        },
      }),

    _noRpcsForRelayChain: () => ContributeState.NoRpcsForRelayChain,
    _noChaindataForRelayChain: () => ContributeState.NoChaindataForRelayChain,
    _ipBanned: () => ContributeState.IpBanned,
    _initialized: props => ContributeState.Ready(props),

    _setApi: (api?: ApiPromise) =>
      state.match({
        Ready: props => {
          if (props.api) props.api.disconnect()
          return ContributeState.Ready({ ...props, api })
        },
        _: () => {
          console.warn('Ignoring _setApi')
          return state
        },
      }),

    setContributionAmount: (contributionAmount: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            contributionAmount: filterContributionAmount(contributionAmount),
            submissionRequested: false,
            submissionValidated: false,
          }),
        _: () => {
          console.warn('Ignoring setContributionAmount')
          return state
        },
      }),

    setAccount: (account?: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            account,
            submissionRequested: false,
            submissionValidated: false,
          }),
        _: () => {
          console.warn('Ignoring setAccount')
          return state
        },
      }),

    setEmail: (email?: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            email,
            submissionRequested: false,
            submissionValidated: false,
          }),
        _: () => {
          console.warn('Ignoring setEmail')
          return state
        },
      }),

    setVerifierSignature: (verifierSignature?: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            verifierSignature,
          }),
        _: () => {
          console.warn('Ignoring setVerifierSignature')
          return state
        },
      }),

    _setAccountBalance: (balance: Balance | null) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            accountBalance: addTokensToBalances([balance], props.relayTokenDecimals)[0],
          }),
        _: () => {
          console.warn('Ignoring _setAccountBalance')
          return state
        },
      }),

    _setValidationError: (validationError?: { i18nCode: string; vars?: { [key: string]: any } }) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            validationError,
            submissionRequested: validationError !== undefined ? false : props.submissionRequested,
            submissionValidated: false,
          }),
        _: () => {
          console.warn('Ignoring _setValidationError')
          return state
        },
      }),

    _setTxFee: (txFee?: string | null) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            txFee,
          }),
        _: () => {
          console.warn('Ignoring _setTxFee')
          return state
        },
      }),

    contribute: () =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            submissionRequested: true,
            submissionValidated: false,
          }),
        _: () => {
          console.warn('Ignoring contribute')
          return state
        },
      }),

    _validateContribution: () =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            validationError: undefined,
            submissionValidated: true,
          }),
        _: () => {
          console.warn('Ignoring _validateContribution')
          return state
        },
      }),

    _setContributionSubmitting: props =>
      state.match({
        Ready: () => ContributeState.ContributionSubmitting(props),
        ContributionSubmitting: () => ContributeState.ContributionSubmitting(props),
        _: () => {
          console.warn('Ignoring _setContributionSubmitting')
          return state
        },
      }),

    _finalizedContributionSuccess: props =>
      state.match({
        ContributionSubmitting: () => ContributeState.ContributionSuccess(props),
        _: () => {
          console.warn('Ignoring _finalizedContributionSuccess')
          return state
        },
      }),

    _finalizedContributionFailed: props =>
      state.match({
        ContributionSubmitting: () => ContributeState.ContributionFailed(props),
        _: () => {
          console.warn('Ignoring _finalizedContributionFailed')
          return state
        },
      }),
  })
}

//
// Hooks (internal)
//

// When in the ContributeState.Initializing state, this thunk will call _setInitialized as needed
function useInitializeThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Initializing: ({ crowdloanId, relayChainId, parachainId }) => ({ crowdloanId, relayChainId, parachainId }),
    _: () => false as false,
  })

  useEffect(() => {
    ;(async () => {
      if (!stateDeps) return
      const { crowdloanId, relayChainId, parachainId } = stateDeps

      const [relayChaindata, chaindata] = await Promise.all([
        Chaindata.chain(relayChainId.toString()),
        Chaindata.chain(`${relayChainId}-${parachainId}`),
      ])
      const relayExtraChaindata = SupportedRelaychains[relayChainId]
      const relayChainCustomRpcs = customRpcs[relayChainId.toString()]

      const relayRpcs = relayChainCustomRpcs.length > 0 ? relayChainCustomRpcs : relayChaindata?.rpcs || []
      const hasRelayRpcs = relayRpcs.length > 0
      if (!hasRelayRpcs) return dispatch(ContributeEvent._noRpcsForRelayChain)

      const { nativeToken: relayNativeToken, tokenDecimals: relayTokenDecimals } = relayChaindata
      if (!relayNativeToken) return dispatch(ContributeEvent._noChaindataForRelayChain)
      if (!relayTokenDecimals) return dispatch(ContributeEvent._noChaindataForRelayChain)

      const parachainName = chaindata.name !== null ? chaindata.name : undefined

      if (relayChainId === moonbeamOptions.relayId && parachainId === moonbeamOptions.parachainId) {
        const ipBlockedResponse = await fetch(`${moonbeamOptions.api}/health`, {
          headers: { 'x-api-key': moonbeamOptions.apiKey },
        })
        const status = ipBlockedResponse.status
        if (status !== 200) return dispatch(ContributeEvent._ipBanned)
      }

      dispatch(
        ContributeEvent._initialized({
          crowdloanId,
          relayChainId,
          relayNativeToken,
          relayTokenDecimals,
          relayRpcs,
          parachainId,
          parachainName,
          subscanUrl: relayExtraChaindata?.subscanUrl,
          contributionAmount: '',
          submissionRequested: false,
          submissionValidated: false,
        })
      )
    })()
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

// When in the ContributeState.Ready state, this thunk will call setApi as needed
function useApiThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({ relayRpcs }) => ({ relayRpcs }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { relayRpcs } = stateDeps

    let shouldDisconnect = false

    ApiPromise.create({ provider: new WsProvider(relayRpcs) }).then(api => {
      if (shouldDisconnect) return api.disconnect()
      dispatch(ContributeEvent._setApi(api))
    })

    return () => {
      shouldDisconnect = true
      dispatch(ContributeEvent._setApi())
    }
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

// When in the ContributeState.Ready state, this thunk will call setAccountBalance as needed
function useAccountBalanceThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
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

    const unsubscribe = Talisman.init({ type: 'TALISMANCONNECT', rpcs: customRpcs }).subscribeBalances(
      chainIds,
      addresses,
      balance => dispatch(ContributeEvent._setAccountBalance(balance))
    )

    return unsubscribe
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useValidateAccountHasContributionBalanceThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({ relayChainId, parachainId, contributionAmount, verifierSignature, accountBalance }) => ({
      relayChainId,
      parachainId,
      contributionAmount,
      verifierSignature,
      accountBalance,
    }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { relayChainId, parachainId, contributionAmount, verifierSignature, accountBalance } = stateDeps

    if (relayChainId === moonbeamOptions.relayId && parachainId === moonbeamOptions.parachainId) {
      if (!verifierSignature) return
    }

    const setBalanceError = () => dispatch(ContributeEvent._setValidationError({ i18nCode: 'Account balance too low' }))
    const clearBalanceError = () => dispatch(ContributeEvent._setValidationError())

    if (!contributionAmount || contributionAmount === '') return clearBalanceError()
    if (Number.isNaN(Number(contributionAmount))) return clearBalanceError()
    if (!accountBalance || !accountBalance.tokens) return clearBalanceError()
    if (new BigNumber(contributionAmount).isLessThanOrEqualTo(new BigNumber(accountBalance.tokens)))
      return clearBalanceError()

    setBalanceError()
  }, [dispatch, JSON.stringify(stateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useTxFeeThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({
      relayChainId,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      verifierSignature,
      api,
    }) => ({
      relayChainId,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      verifierSignature,
      api,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!stateDeps) return
      const {
        relayChainId,
        relayTokenDecimals,
        parachainId,
        contributionAmount,
        account,
        email,
        verifierSignature,
        api,
      } = stateDeps

      dispatch(ContributeEvent._setTxFee())

      if (!api || !api.isReady) return
      if (!contributionAmount) return dispatch(ContributeEvent._setTxFee(null))
      if (!account) return dispatch(ContributeEvent._setTxFee(null))

      const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)

      let tx
      try {
        tx = await buildTx({
          relayChainId,
          parachainId,

          contributionPlanck,
          account,
          email,
          verifierSignature,

          api,
          estimateOnly: true,
        })
      } catch (error: any) {
        dispatch(ContributeEvent._setValidationError({ i18nCode: error?.message || error.toString() }))
        return
      }

      const { partialFee } = await tx.paymentInfo(account)
      const feeTokens = planckToTokens(partialFee.toString(), relayTokenDecimals)

      if (cancelled) return

      dispatch(ContributeEvent._setTxFee(feeTokens))
    })()

    return () => {
      cancelled = true
      dispatch(ContributeEvent._setTxFee(null))
    }
  }, [dispatch, stateDeps && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useMoonbeamThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      api,
      accountBalance,
      submissionRequested,
    }) => ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      api,
      accountBalance,
      submissionRequested,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  // don't fetch contributions unless we're on moonbeam crowdloan
  // (if accounts is [] then useCrowdloanContributions will skip the query)
  const contributionsProps =
    stateDeps !== false &&
    stateDeps.account !== undefined &&
    stateDeps.relayChainId === moonbeamOptions.relayId &&
    stateDeps.parachainId === moonbeamOptions.parachainId
      ? { accounts: [stateDeps.account], crowdloans: [stateDeps.crowdloanId] }
      : { accounts: [], crowdloans: [] }

  const { contributions, hydrated: contributionsHydrated } = useCrowdloanContributions(contributionsProps)

  useEffect(() => {
    if (!stateDeps) return
    const {
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      api,
      submissionRequested,
    } = stateDeps

    if (relayChainId !== moonbeamOptions.relayId || parachainId !== moonbeamOptions.parachainId) return
    if (!account) return
    if (!contributionsHydrated) return

    const previousTotalContributions = contributions.reduce(
      (total, contribution) => addBigNumbers(total, contribution.amount),
      '0'
    )

    ;(async () => {
      const checkRemarkResponse = await fetch(
        `${moonbeamOptions.api}/check-remark/${encodeAnyAddress(account, relayChainId)}`,
        { headers: { 'x-api-key': moonbeamOptions.apiKey } }
      )

      if (!checkRemarkResponse.ok) {
        return dispatch(
          ContributeEvent._setValidationError({ i18nCode: 'The Moonbeam API is unavailable, please try again later' })
        )
      }
      if (!(await checkRemarkResponse.json()).verified) {
        // TODO: Replace this with a state change to a moonbeam-specific registration flow
        return dispatch(ContributeEvent._setValidationError({ i18nCode: 'Please register for the Moonbeam crowdloan' }))
      }

      const guid = uuidv4()
      const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)
      const makeSignatureResponse = await fetch(`${moonbeamOptions.api}/make-signature`, {
        method: 'POST',
        headers: { 'x-api-key': moonbeamOptions.apiKey },
        body: JSON.stringify({
          'address': encodeAnyAddress(account, relayChainId),
          // TODO: Retrieve prior contributions
          'previous-total-contribution': previousTotalContributions,
          'contribution': contributionPlanck,
          'guid': guid,
        }),
      })
      if (!makeSignatureResponse.ok)
        return dispatch(
          ContributeEvent._setValidationError({ i18nCode: 'The Moonbeam API is unavailable, please try again later' })
        )
      const { signature } = await makeSignatureResponse.json()

      // TODO: Check if signature is undefined, if so - the previous line should instead be
      // const { data: { signature } } = await makeSignatureResponse.json()

      console.log({ checkRemarkResponse, signature })

      dispatch(ContributeEvent.setVerifierSignature(signature))
    })()
  }, [dispatch, contributions, contributionsHydrated, stateDeps && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useValidateContributionThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      api,
      accountBalance,
      txFee,
      submissionRequested,
    }) => ({
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      api,
      accountBalance,
      txFee,
      submissionRequested,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    if (!stateDeps) return
    const {
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      api,
      accountBalance,
      txFee,
      submissionRequested,
    } = stateDeps

    if (!submissionRequested) return

    const setError = (error: { i18nCode: string; vars?: { [key: string]: any } }) =>
      dispatch(ContributeEvent._setValidationError(error))

    if (!contributionAmount || contributionAmount.length < 1 || Number(contributionAmount) === 0) {
      setError({ i18nCode: 'Please enter an amount of {{token}}', vars: { token: relayNativeToken } })
      return
    }
    if (Number.isNaN(Number(contributionAmount))) {
      setError({ i18nCode: 'Please enter a valid amount of {{token}}', vars: { token: relayNativeToken } })
      return
    }
    if (!account || account.length < 1) {
      setError({ i18nCode: 'An account must be selected' })
      return
    }

    if (!accountBalance?.tokens) return
    if (new BigNumber(accountBalance.tokens).isLessThan(new BigNumber(contributionAmount))) {
      setError({ i18nCode: 'Account balance too low' })
      return
    }

    if (!api) return

    const minContribution =
      relayChainId === acalaOptions.relayId && parachainId === acalaOptions.parachainId
        ? '1' // acala liquid crowdloan has a minimum of 1 DOT
        : api.consts.crowdloan.minContribution.toString()
    const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)
    const minimum = new BigNumber(planckToTokens(minContribution.toString(), relayTokenDecimals) || '').toFixed(2)

    if (!contributionPlanck || new BigNumber(contributionPlanck).isLessThan(new BigNumber(minContribution))) {
      setError({
        i18nCode: 'A minimum of {{minimum}} {{token}} is required',
        vars: { minimum, token: relayNativeToken },
      })
      return
    }

    if (typeof txFee !== 'string') return

    // TODO: Test that contribution doesn't go above crowdloan cap
    // TODO: Test that crowdloan has not ended
    // TODO: Test that crowdloan is in a valid lease period
    // TODO: Test that crowdloan has not already won
    // TODO: Validate validator signature
    // https://github.com/paritytech/polkadot/blob/dee1484760aedfd699e764f2b7c7d85855f7b077/runtime/common/src/crowdloan.rs#L432

    const existentialDeposit = relayChainId === 2 ? 0.0000333333 : relayChainId === 0 ? 1 : 1
    const expectedLoss = new BigNumber(contributionAmount).plus(new BigNumber(txFee))

    if (
      new BigNumber(accountBalance.tokens)
        .minus(new BigNumber(expectedLoss))
        .isLessThanOrEqualTo(new BigNumber(existentialDeposit))
    ) {
      setError({
        i18nCode: `Your account can't go below a minimum of {{existentialDeposit}} {{token}}`,
        vars: { existentialDeposit, token: relayNativeToken },
      })
      return
    }

    dispatch(ContributeEvent._validateContribution)
  }, [dispatch, stateDeps && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useSignAndSendContributionThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({
      relayChainId,
      relayTokenDecimals,
      parachainId,
      subscanUrl,
      contributionAmount,
      account,
      email,
      verifierSignature,
      api,
      submissionValidated,
    }) => ({
      relayChainId,
      relayTokenDecimals,
      parachainId,
      subscanUrl,
      contributionAmount,
      account,
      email,
      verifierSignature,
      api,
      submissionValidated,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!stateDeps) return
      const {
        relayChainId,
        relayTokenDecimals,
        parachainId,
        subscanUrl,
        contributionAmount,
        account,
        email,
        verifierSignature,
        api,
        submissionValidated,
      } = stateDeps

      if (!submissionValidated) return
      if (!account) return

      if (!api) return
      const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)

      const injector = await web3FromAddress(account)
      if (cancelled) return

      let tx
      try {
        tx = await buildTx({
          relayChainId,
          parachainId,

          contributionPlanck,
          account,
          email,
          verifierSignature,

          api,
        })
      } catch (error: any) {
        dispatch(ContributeEvent._setValidationError({ i18nCode: error?.message || error.toString() }))
        return
      }

      let txSigned
      try {
        txSigned = await tx.signAsync(account, { signer: injector.signer })
      } catch (error: any) {
        dispatch(ContributeEvent._setValidationError({ i18nCode: error?.message || error.toString() }))
        return
      }
      if (cancelled) return

      dispatch(ContributeEvent._setContributionSubmitting({}))

      try {
        const unsub = await txSigned.send(async result => {
          const { status, events = [], dispatchError } = result

          for (const {
            phase,
            event: { data, method, section },
          } of events) {
            console.info(`\t${phase}: ${section}.${method}:: ${data}`)
          }

          if (status.isInBlock) {
            console.info(`Transaction included at blockHash ${status.asInBlock}`)
            dispatch(
              ContributeEvent._setContributionSubmitting({
                explorerUrl: await deriveExplorerUrl(api, result, subscanUrl),
              })
            )
          }
          if (status.isFinalized) {
            console.info(`Transaction finalized at blockHash ${status.asFinalized}`)
            unsub()

            let success = false
            let error
            if (
              events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess') &&
              !events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed')
            ) {
              success = true
            }

            // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
            if (dispatchError && dispatchError.isModule && api) {
              const decoded = api.registry.findMetaError(dispatchError.asModule)
              const { docs, name, section } = decoded
              error = `${section}.${name}: ${docs.join(' ')}`
            } else if (dispatchError) {
              error = dispatchError.toString()
            }

            const explorerUrl = await deriveExplorerUrl(api, result, subscanUrl)

            if (success && !error) {
              dispatch(ContributeEvent._finalizedContributionSuccess({ explorerUrl }))
              trackGoal('GTVDUALL', 1) // crowdloan_contribute
              trackGoal('WQGRJ9OC', parseInt(contributionPlanck, 10)) // crowdloan_contribute_amount

              if (relayChainId === 0) trackGoal('JFOFGXPN', parseInt(contributionPlanck, 10)) // crowdloan_contribute_amount_DOT
              if (relayChainId === 2) trackGoal('QG3QGBYH', parseInt(contributionPlanck, 10)) // crowdloan_contribute_amount_KSM
            } else {
              dispatch(ContributeEvent._finalizedContributionFailed({ error, explorerUrl }))
            }
          }
        })
      } catch (error: any) {
        dispatch(ContributeEvent._finalizedContributionFailed({ error: error?.message || error.toString() }))
        return
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, stateDeps && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

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

type BuildTxProps = {
  relayChainId: number
  parachainId: number

  contributionPlanck: string
  account: string
  email?: string
  verifierSignature?: string

  api: ApiPromise
  estimateOnly?: true
}
type BuildTxResponse = SubmittableExtrinsic<'promise', ISubmittableResult>
async function buildTx(props: BuildTxProps): Promise<BuildTxResponse> {
  const buildTxFuncs = {
    [`${acalaOptions.relayId}-${acalaOptions.parachainId}`]: buildAcalaTx,
    [`${astarOptions.relayId}-${astarOptions.parachainId}`]: buildAstarTx,
  }

  const relayWithParachainId = `${props.relayChainId}-${props.parachainId}`
  const buildTxFunc = buildTxFuncs[relayWithParachainId] || buildGenericTx

  return await buildTxFunc(props)
}

async function buildGenericTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const txs = [
    api.tx.crowdloan.contribute(parachainId, contributionPlanck, verifierSignature),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs)
}

async function buildAstarTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const referrerAddress = astarOptions.referral

  const txs = [
    api.tx.crowdloan.contribute(parachainId, contributionPlanck, verifierSignature),
    api.tx.crowdloan.addMemo(parachainId, referrerAddress),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs)
}

async function buildAcalaTx({
  relayChainId,
  contributionPlanck,
  account,
  email,
  api,
  estimateOnly,
}: BuildTxProps): Promise<BuildTxResponse> {
  // don't bother acala's API when we only want to calculate a txFee
  const statementResult = estimateOnly
    ? {
        paraId: acalaOptions.parachainId,
        statementMsgHash: '0x39d8579eba72f48339686db6c4f6fb1c3164bc09b10226e64211c12b0b43460d',
        statement:
          'I hereby agree to the terms of the statement whose SHA-256 multihash is QmeUtSuuMBAKzcfLJB2SnMfQoeifYagyWrrNhucRX1vjA8. (This may be found at the URL: https://acala.network/acala/terms)',
        proxyAddress: '12CnY6b89bFfTbM6Wh3cdFvHAfxxsDUQHHXtT2Ui7SQzxBrn',
      }
    : await (await fetch(`${acalaOptions.api}/statement`)).json()

  const proxyAddress = statementResult.proxyAddress
  const statement = statementResult.statement

  if (!proxyAddress || proxyAddress.length < 1) throw new Error('Internal error (missing proxy address)')
  if (!statement || statement.length < 1) throw new Error('Internal error (missing statement)')

  const address = encodeAnyAddress(account, relayChainId)
  const amount = contributionPlanck
  const referral = acalaOptions.referral
  const receiveEmail = email !== undefined && email.length > 0

  if (!estimateOnly) {
    const response = await fetch(`${acalaOptions.api}/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${acalaOptions.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        amount,
        referral,
        email: receiveEmail ? email : undefined,
        receiveEmail,
      }),
    })
    if (!response.ok) throw new Error('Acala API rate-limit reached. Please try again in 60 seconds.')
  }

  const txs = [
    api.tx.balances.transfer(proxyAddress, amount),
    api.tx.system.remarkWithEvent(statement),
    api.tx.system.remarkWithEvent(`referrer:${referral}`),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs)
}

async function deriveExplorerUrl(
  api: ApiPromise,
  result: ISubmittableResult,
  subscanUrl?: string
): Promise<string | undefined> {
  if (!subscanUrl) return

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

function encodePolkadotAddressAsHexadecimalPublicKey(polkadotAddress: string): string {
  const byteArray = decodeAnyAddress(polkadotAddress)
  const hexEncoded = [...byteArray].map(x => x.toString(16).padStart(2, '0')).join('')
  return `0x${hexEncoded}`
}
