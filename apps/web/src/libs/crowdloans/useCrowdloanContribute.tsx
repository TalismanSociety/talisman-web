/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { SupportedRelaychains, parachainDetails } from '@libs/talisman/util/_config'
import { ApiPromise, type SubmittableResult, WsProvider } from '@polkadot/api'
import { type SubmittableExtrinsic } from '@polkadot/api/submittable/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { isEthereumChecksum } from '@polkadot/util-crypto'
import { encodeAnyAddress, planckToTokens, tokensToPlanck } from '@talismn/util'
import customRpcs from '@util/customRpcs'
import { Maybe } from '@util/monads'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { type MemberType, makeTaggedUnion, none } from 'safety-match'
import { v4 as uuidv4 } from 'uuid'

import { Acala, Astar, Moonbeam, Zeitgeist } from './crowdloanOverrides'
import { submitTermsAndConditions } from './moonbeam/remarkFlow'
import { useCrowdloanContributions } from './useCrowdloanContributions'

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
  Ready: (props: ReadyProps) => props,
  RegisteringUser: (props: RegisteringUserProps) => props,
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
  setVerifierSignature: (verifierSignature?: VerifierSignature) => verifierSignature,
  setMemoAddress: (memoAddress?: string) => memoAddress,
  _setAccountBalance: (balance: string | null) => balance,
  _setTxFee: (txFee?: string | null) => txFee,
  _setValidationError: (validationError?: { i18nCode: string; vars?: Record<string, any> }) => validationError,
  contribute: none,
  _setRegisteringUser: (props: RegisteringUserProps) => props,
  registerUser: none,
  _userRegistered: (props: ReadyProps) => props,
  _validateContribution: none,
  _setContributionSubmitting: (props: ContributionSubmittingProps) => props,
  _finalizedContributionSuccess: (props: ContributionSuccessProps) => props,
  _finalizedContributionFailed: (props: ContributionFailedProps) => props,
})
export type ContributeEvent = MemberType<typeof ContributeEvent> // eslint-disable-line @typescript-eslint/no-redeclare

// The callback for dispatching ContributeEvents
// This is returned from the useCrowdloanContribute hook
export type DispatchContributeEvent = (event: ContributeEvent) => void

type VerifierSignature = { sr25519: string } | { ed25519: string }

// All of the types of props which are passed to the various state constructors
type InitializeProps = {
  crowdloanId: string
  relayChainId: number
  parachainId: number
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
  verifierSignature?: VerifierSignature
  memoAddress?: string

  api?: ApiPromise
  accountBalance?: string | null
  txFee?: string | null
  validationError?: { i18nCode: string; vars?: Record<string, any> }
  submissionRequested: boolean
  submissionValidated: boolean
}
type RegisteringUserProps = {
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

  api?: ApiPromise
  submissionRequested: boolean
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
  useTxFeeThunk(state, dispatch)
  useValidateAccountHasContributionBalanceThunk(state, dispatch)
  useValidateContributionThunk(state, dispatch)

  useMoonbeamVerifierSignatureThunk(state, dispatch)
  useMoonbeamRegisterUserThunk(state, dispatch)
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
  const ignoreWithWarning = () => {
    console.warn(`Ignoring ContributeEvent.${event.variant}`)
    return state
  }
  const ignoreWithContextWarning = (context: string) => () => {
    console.warn(`Ignoring ContributeEvent.${event.variant}: ${context}`)
    return state
  }

  return event.match({
    initialize: props =>
      state.match({
        Uninitialized: () => ContributeState.Initializing(props),
        _: ignoreWithContextWarning('ContributeState is already initialized'),
      }),

    _noRpcsForRelayChain: () => ContributeState.NoRpcsForRelayChain,
    _noChaindataForRelayChain: () => ContributeState.NoChaindataForRelayChain,
    _ipBanned: () => ContributeState.IpBanned,
    _initialized: props => ContributeState.Ready(props),

    _setApi: (api?: ApiPromise) =>
      state.match({
        Ready: props => {
          if (props.api) void props.api.disconnect()
          return ContributeState.Ready({ ...props, api })
        },
        RegisteringUser: props => {
          if (props.api) void props.api.disconnect()
          return ContributeState.RegisteringUser({ ...props, api })
        },
        _: ignoreWithWarning,
      }),

    setContributionAmount: (contributionAmount: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            contributionAmount: filterContributionAmount(contributionAmount),
            verifierSignature: undefined, // changes in contribution amount need a new signature
            submissionRequested: false,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    setAccount: (account?: string) =>
      state.match({
        Ready: props => {
          // don't reset verifierSignature/submissionRequested/etc when user re-selects the already-selected account
          if (account === props.account) return state

          return ContributeState.Ready({
            ...props,
            account,
            accountBalance: undefined,
            verifierSignature: undefined, // changes in account need a new signature
            submissionRequested: false,
            submissionValidated: false,
          })
        },
        _: ignoreWithWarning,
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
        _: ignoreWithWarning,
      }),

    setVerifierSignature: (verifierSignature?: VerifierSignature) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            verifierSignature,
            // verifierSignature is set automatically by a thunk, not by text input from the user
            // as such, we should continue with the user's request to submit their contribution - even if the verifierSignature has since changed
            // submissionRequested: false,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    setMemoAddress: (memoAddress?: string) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            memoAddress,
            submissionRequested: false,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    _setAccountBalance: (balance: string | null) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            accountBalance: balance,
          }),
        _: ignoreWithWarning,
      }),

    _setTxFee: (txFee?: string | null) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            txFee,
          }),
        _: ignoreWithWarning,
      }),

    _setValidationError: (validationError?: { i18nCode: string; vars?: Record<string, any> }) =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            validationError,
            // if a validationError is shown to the user, we should cancel their request to submit their contribution
            submissionRequested: validationError !== undefined ? false : props.submissionRequested,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    contribute: () =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            submissionRequested: true,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    _setRegisteringUser: props =>
      state.match({
        Ready: () => ContributeState.RegisteringUser(props),
        _: ignoreWithWarning,
      }),

    registerUser: () =>
      state.match({
        RegisteringUser: props =>
          ContributeState.RegisteringUser({
            ...props,
            submissionRequested: true,
          }),
        _: ignoreWithWarning,
      }),

    _userRegistered: props =>
      state.match({
        RegisteringUser: () =>
          ContributeState.Ready({
            ...props,
            submissionRequested: true,
            submissionValidated: false,
          }),
        _: ignoreWithWarning,
      }),

    _validateContribution: () =>
      state.match({
        Ready: props =>
          ContributeState.Ready({
            ...props,
            validationError: undefined,
            submissionValidated: true,
          }),
        _: ignoreWithWarning,
      }),

    _setContributionSubmitting: props =>
      state.match({
        Ready: () => ContributeState.ContributionSubmitting(props),
        ContributionSubmitting: () => ContributeState.ContributionSubmitting(props),
        _: ignoreWithWarning,
      }),

    _finalizedContributionSuccess: props =>
      state.match({
        ContributionSubmitting: () => ContributeState.ContributionSuccess(props),
        _: ignoreWithWarning,
      }),

    _finalizedContributionFailed: props =>
      state.match({
        ContributionSubmitting: () => ContributeState.ContributionFailed(props),
        _: ignoreWithWarning,
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
    void (async () => {
      if (!stateDeps) return
      const { crowdloanId, relayChainId, parachainId } = stateDeps

      const relayChaindata = SupportedRelaychains[relayChainId]
      const relayExtraChaindata = SupportedRelaychains[relayChainId]
      const relayChainCustomRpcs = customRpcs[relayChainId.toString()]

      const relayRpcs =
        relayChainCustomRpcs?.length! > 0
          ? relayChainCustomRpcs ?? []
          : Maybe.of(relayChaindata?.rpc).mapOrUndefined(x => [x]) ?? []
      const hasRelayRpcs = relayRpcs?.length > 0
      if (!hasRelayRpcs) return dispatch(ContributeEvent._noRpcsForRelayChain)

      const { tokenSymbol: relayNativeToken, tokenDecimals: relayTokenDecimals } = relayChaindata!
      if (!relayNativeToken) return dispatch(ContributeEvent._noChaindataForRelayChain)
      if (!relayTokenDecimals) return dispatch(ContributeEvent._noChaindataForRelayChain)

      const parachainName = parachainDetails.find(x => x.id === `${relayChainId}-${parachainId}`)?.name

      if (Moonbeam.is(relayChainId, parachainId)) {
        const ipBlockedResponse = await fetch(`${Moonbeam.api}/health`, {
          headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        })
        const status = ipBlockedResponse.status
        const body = await ipBlockedResponse.text()
        if (status !== 200 || body !== '') return dispatch(ContributeEvent._ipBanned)
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
    RegisteringUser: ({ relayRpcs }) => ({ relayRpcs }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { relayRpcs } = stateDeps

    let shouldDisconnect = false

    void ApiPromise.create({ provider: new WsProvider(relayRpcs) }).then(async api => {
      if (shouldDisconnect) return await api.disconnect()
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
  const { api, account, relayTokenDecimals } = state.match({
    Ready: ({ api, account, relayTokenDecimals }) => ({ api, account, relayTokenDecimals }),
    _: () => ({ api: undefined, account: undefined, relayTokenDecimals: undefined }),
  })

  useEffect(() => {
    if (api === undefined || account === undefined || relayTokenDecimals === undefined) {
      return
    }

    void (async () => {
      const balances = await api.derive.balances.all(account)

      dispatch(
        ContributeEvent._setAccountBalance(
          new BigNumber(balances.availableBalance.toString()).shiftedBy(-relayTokenDecimals).toString()
        )
      )
    })()
  }, [account, api, dispatch, relayTokenDecimals])
}

function useValidateAccountHasContributionBalanceThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({ contributionAmount, accountBalance }) => ({ contributionAmount, accountBalance }),
    _: () => false as false,
  })

  useEffect(() => {
    if (!stateDeps) return
    const { contributionAmount, accountBalance } = stateDeps

    const setBalanceError = () => dispatch(ContributeEvent._setValidationError({ i18nCode: 'Account balance too low' }))
    const clearBalanceError = () => dispatch(ContributeEvent._setValidationError())

    if (!contributionAmount || contributionAmount === '') return clearBalanceError()
    if (Number.isNaN(Number(contributionAmount))) return clearBalanceError()
    if (!accountBalance) return clearBalanceError()
    if (new BigNumber(contributionAmount).isLessThanOrEqualTo(new BigNumber(accountBalance))) return clearBalanceError()

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
      memoAddress,
      api,
    }) => ({
      relayChainId,
      relayTokenDecimals,
      parachainId,
      contributionAmount,
      account,
      email,
      verifierSignature,
      memoAddress,
      api,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    let cancelled = false

    void (async () => {
      if (!stateDeps) return
      const {
        relayChainId,
        relayTokenDecimals,
        parachainId,
        contributionAmount,
        account,
        email,
        verifierSignature,
        memoAddress,
        api,
      } = stateDeps

      dispatch(ContributeEvent._setTxFee())

      if (!api?.isReady) return
      if (!contributionAmount) return dispatch(ContributeEvent._setTxFee(null))
      if (!account) return dispatch(ContributeEvent._setTxFee(null))
      if (Moonbeam.is(relayChainId, parachainId) && !memoAddress) return dispatch(ContributeEvent._setTxFee(null))

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
          memoAddress,

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
  }, [dispatch, stateDeps !== false && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useMoonbeamVerifierSignatureThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    Ready: ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,
      verifierSignature,

      api,
      submissionRequested,
      submissionValidated,
    }) => ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,
      verifierSignature,

      api,
      submissionRequested,
      submissionValidated,
    }),
    _: () => false as false,
  })
  // don't fetch contributions unless we're on moonbeam crowdloan
  // (if accounts is [] then useCrowdloanContributions will skip the query)
  const contributionsProps =
    stateDeps !== false && stateDeps.account !== undefined && Moonbeam.is(stateDeps.relayChainId, stateDeps.parachainId)
      ? { accounts: [stateDeps.account], crowdloans: [stateDeps.crowdloanId] }
      : { accounts: [], crowdloans: [] }

  const { contributions, hydrated: contributionsHydrated } = useCrowdloanContributions(contributionsProps)

  useEffect(() => {
    if (!stateDeps) return
    const {
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,
      verifierSignature,

      api,
      submissionRequested,
      submissionValidated,
    } = stateDeps

    if (!Moonbeam.is(relayChainId, parachainId)) return
    if (!account) return
    if (!contributionsHydrated) return
    if (!api) return

    // cancel if we have already calculated a verifierSignature
    if (verifierSignature) return

    // wait for user to hit submit
    if (!submissionRequested) return

    // wait for clientside validations to complete
    if (!submissionValidated) return
    void (async () => {
      // check if user is already registered for the moonbeam crowdloan
      const checkRemarkResponse = await fetch(
        `${Moonbeam.api}/check-remark/${encodeAnyAddress(account, relayChainId)}`,
        { headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined }
      )
      if (!checkRemarkResponse.ok)
        return dispatch(
          ContributeEvent._setValidationError({
            i18nCode: 'The Moonbeam API is unavailable, please try again later',
          })
        )
      if (!(await checkRemarkResponse.json()).verified)
        return dispatch(
          ContributeEvent._setRegisteringUser({
            crowdloanId,
            relayChainId,
            relayNativeToken,
            relayTokenDecimals,
            relayRpcs,
            parachainId,
            parachainName,
            subscanUrl,

            contributionAmount,
            account,
            email,

            api,
            submissionRequested: false,
          })
        )

      // get verificationSignature from moonbeam api
      const guid = uuidv4()
      const previousTotalContributions = contributions
        .reduce((total, contribution) => new BigNumber(total).plus(contribution.amount), new BigNumber(0))
        .toString()
      const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)
      const makeSignatureResponse = await fetch(`${Moonbeam.api}/make-signature`, {
        method: 'POST',
        headers: Moonbeam.apiKey ? { 'x-api-key': Moonbeam.apiKey } : undefined,
        body: JSON.stringify({
          'address': encodeAnyAddress(account, relayChainId),
          'previous-total-contribution': previousTotalContributions,
          'contribution': contributionPlanck,
          guid,
        }),
      })
      if (!makeSignatureResponse.ok)
        return dispatch(
          ContributeEvent._setValidationError({ i18nCode: 'The Moonbeam API is unavailable, please try again later' })
        )
      const { signature } = await makeSignatureResponse.json()

      dispatch(ContributeEvent.setVerifierSignature({ sr25519: signature as string }))
    })()
  }, [dispatch, contributions, contributionsHydrated, stateDeps]) // eslint-disable-line react-hooks/exhaustive-deps
}

function useMoonbeamRegisterUserThunk(state: ContributeState, dispatch: DispatchContributeEvent) {
  const stateDeps = state.match({
    RegisteringUser: ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,

      api,
      submissionRequested,
    }) => ({
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,

      api,
      submissionRequested,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    if (!stateDeps) return

    const {
      crowdloanId,
      relayChainId,
      relayNativeToken,
      relayTokenDecimals,
      relayRpcs,
      parachainId,
      parachainName,
      subscanUrl,

      contributionAmount,
      account,
      email,

      api,
      submissionRequested,
    } = stateDeps

    if (!api) return
    if (!submissionRequested) return
    if (!account)
      return dispatch(
        ContributeEvent._initialized({
          crowdloanId,
          relayChainId,
          relayNativeToken,
          relayTokenDecimals,
          relayRpcs,
          parachainId,
          parachainName,
          subscanUrl,

          contributionAmount,
          account,
          email,

          api,
          submissionRequested: false,
          submissionValidated: false,
        })
      )
    void (async () => {
      const verified = await submitTermsAndConditions(api, encodeAnyAddress(account, relayChainId))
      if (!verified) throw new Error('Failed to verify user registration')
      dispatch(
        ContributeEvent._userRegistered({
          crowdloanId,
          relayChainId,
          relayNativeToken,
          relayTokenDecimals,
          relayRpcs,
          parachainId,
          parachainName,
          subscanUrl,

          contributionAmount,
          account,
          email,

          api,
          submissionRequested: true,
          submissionValidated: false,
        })
      )
    })()
  }, [dispatch, stateDeps !== false && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
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
      memoAddress,

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
      memoAddress,

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
      memoAddress,

      api,
      accountBalance,
      txFee,
      submissionRequested,
    } = stateDeps

    // these validations will only run after the user hits submit
    if (!submissionRequested) return

    const setError = (error: { i18nCode: string; vars?: Record<string, any> }) =>
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
    if (Moonbeam.is(relayChainId, parachainId) && (!memoAddress || memoAddress.length < 1)) {
      setError({ i18nCode: 'Please enter your moonbeam rewards address' })
      return
    }
    if (Moonbeam.is(relayChainId, parachainId) && (!memoAddress || !isEthereumChecksum(memoAddress))) {
      setError({ i18nCode: 'Please enter a valid moonbeam rewards address' })
      return
    }

    if (!accountBalance) return
    if (new BigNumber(accountBalance).isLessThan(new BigNumber(contributionAmount))) {
      setError({ i18nCode: 'Account balance too low' })
      return
    }

    if (!api) return

    const minContribution = Acala.is(relayChainId, parachainId)
      ? '1' // acala liquid crowdloan has a minimum of 1 DOT
      : api.consts.crowdloan?.minContribution?.toString()
    const contributionPlanck = tokensToPlanck(contributionAmount, relayTokenDecimals)
    const minimum = new BigNumber(planckToTokens(minContribution?.toString(), relayTokenDecimals) || '').toFixed(2)

    if (!contributionPlanck || new BigNumber(contributionPlanck).isLessThan(new BigNumber(minContribution ?? 0))) {
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
      new BigNumber(accountBalance)
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
  }, [dispatch, stateDeps !== false && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
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
      memoAddress,
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
      memoAddress,
      api,
      submissionValidated,
    }),
    _: () => false as false,
  })
  const { api, ...jsonCmpStateDeps } = stateDeps || {}

  useEffect(() => {
    let cancelled = false

    void (async () => {
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
        memoAddress,
        api,
        submissionValidated,
      } = stateDeps

      if (!submissionValidated) return
      if (!account) return

      // after submissionValidated is set to true, useMoonbeamVerifierSignatureThunk will set the verifierSignature
      // we should wait for that to happen before we make the contribution
      if (Moonbeam.is(relayChainId, parachainId) && !verifierSignature) return

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
          memoAddress,

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
            if (dispatchError?.isModule && api) {
              const decoded = api.registry.findMetaError(dispatchError.asModule)
              const { docs, name, section } = decoded
              error = `${section}.${name}: ${docs.join(' ')}`
            } else if (dispatchError) {
              error = dispatchError.toString()
            }

            const explorerUrl = await deriveExplorerUrl(api, result, subscanUrl)

            if (success && !error) {
              dispatch(ContributeEvent._finalizedContributionSuccess({ explorerUrl }))
            } else {
              dispatch(ContributeEvent._finalizedContributionFailed({ error, explorerUrl }))
            }
          }
        })
      } catch (error: any) {
        dispatch(ContributeEvent._finalizedContributionFailed({ error: error?.message || error.toString() }))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, stateDeps !== false && stateDeps?.api, JSON.stringify(jsonCmpStateDeps)]) // eslint-disable-line react-hooks/exhaustive-deps
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
  verifierSignature?: any
  memoAddress?: string

  api: ApiPromise
  estimateOnly?: true
}
type BuildTxResponse = SubmittableExtrinsic<'promise', SubmittableResult>
async function buildTx(props: BuildTxProps): Promise<BuildTxResponse> {
  if (Acala.is(props.relayChainId, props.parachainId)) return await buildAcalaTx(props)
  if (Astar.is(props.relayChainId, props.parachainId)) return await buildAstarTx(props)
  if (Moonbeam.is(props.relayChainId, props.parachainId)) return await buildMoonbeamTx(props)
  if (Zeitgeist.is(props.relayChainId, props.parachainId)) return await buildZeitgeistTx(props)
  return await buildGenericTx(props)
}

async function buildGenericTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const txs = [
    api.tx.crowdloan?.contribute?.(parachainId, contributionPlanck, verifierSignature),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs as any)
}

async function buildZeitgeistTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const txs = [
    api.tx.crowdloan?.contribute?.(parachainId, contributionPlanck, verifierSignature),
    api.tx.system.remarkWithEvent(
      'I have read and agree to the terms found at https://zeitgeist.pm/CrowdloanTerms.pdf'
    ),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs as any[])
}

async function buildMoonbeamTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  memoAddress,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const txs = [
    api.tx.crowdloan?.contribute?.(parachainId, contributionPlanck, verifierSignature),
    api.tx.crowdloan?.addMemo?.(parachainId, memoAddress ?? ''),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs as any)
}

async function buildAstarTx({
  parachainId,
  contributionPlanck,
  verifierSignature,
  api,
}: BuildTxProps): Promise<BuildTxResponse> {
  const referrerAddress = Astar.referrer

  const txs = [
    api.tx.crowdloan?.contribute?.(parachainId, contributionPlanck, verifierSignature),
    api.tx.crowdloan?.addMemo?.(parachainId, referrerAddress ?? ''),
    api.tx.system.remarkWithEvent('Talisman - The Journey Begins'),
  ]

  return api.tx.utility.batchAll(txs as any)
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
        paraId: Acala.paraId,
        statementMsgHash: '0x39d8579eba72f48339686db6c4f6fb1c3164bc09b10226e64211c12b0b43460d',
        statement:
          'I hereby agree to the terms of the statement whose SHA-256 multihash is QmeUtSuuMBAKzcfLJB2SnMfQoeifYagyWrrNhucRX1vjA8. (This may be found at the URL: https://acala.network/acala/terms)',
        proxyAddress: '12CnY6b89bFfTbM6Wh3cdFvHAfxxsDUQHHXtT2Ui7SQzxBrn',
      }
    : await (await fetch(`${Acala.api}/statement`)).json()

  const proxyAddress = statementResult.proxyAddress
  const statement = statementResult.statement

  if (!proxyAddress || proxyAddress.length < 1) throw new Error('Internal error (missing proxy address)')
  if (!statement || statement.length < 1) throw new Error('Internal error (missing statement)')

  const address = encodeAnyAddress(account, relayChainId)
  const amount = contributionPlanck
  const referral = Acala.referrer
  const receiveEmail = email !== undefined && email.length > 0

  if (!estimateOnly) {
    const response = await fetch(`${Acala.api}/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Acala.apiBearerToken}`,
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

export async function deriveExplorerUrl(
  api: ApiPromise,
  result: SubmittableResult,
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
