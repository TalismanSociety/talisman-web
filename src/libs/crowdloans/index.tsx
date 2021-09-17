import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { BalanceOf } from '@polkadot/types/interfaces'
import { addTokensToBalances, groupBalancesByAddress, useBalances, useChain } from '@talismn/api-react-hooks'
import { Deferred, addBigNumbers, planckToTokens, tokensToPlanck, useFuncMemo } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

//
// TODO: Integrate this lib into @talismn/api.
// TODO: Move tx handling into a generic queue, store queue in react context
//

//
// Types
//

export type Status = 'INIT' | 'IDLE' | 'VALIDATING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'

export type CrowdloanContribution = {
  chaindata?: {
    name?: string
    description?: string
    nativeToken?: string
    tokenDecimals?: number
    links?: { [key: string]: string }
    isRelay?: boolean
    assets?: { logo?: string; banner?: string; card?: string }
    rpcs?: string[]
  }
  contribute: () => Promise<void>
  status: string
  explorerUrl: string | null
  error: string | null
}

//
// Hooks (exported)
//

export function useCrowdloanContribution(
  parachainId?: number,
  contributionAmount?: string,
  account?: string,
  signature: string | null = null
): CrowdloanContribution {
  const [status, setStatus] = useState<Status>('INIT')
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const kusamaId = '2'
  const chaindata = useChain(kusamaId)
  const hasRpcs = useMemo(() => Array.isArray(chaindata?.rpcs) && chaindata.rpcs.length > 0, [chaindata])

  const [, apiPromise] = useApi(chaindata?.rpcs)

  const chainIds = useMemo(() => [kusamaId], []) // 2 is kusama
  const addresses = useMemo(() => (account ? [account] : []), [account])

  const { nativeToken, tokenDecimals } = chaindata
  const { balances } = useBalances(addresses, chainIds)

  const ksmBalances = useFuncMemo(addTokensToBalances, balances, nativeToken ? tokenDecimals : undefined)
  const ksmBalancesByAddress = useFuncMemo(groupBalancesByAddress, ksmBalances)
  const ksmBalance = useMemo(() => {
    if (!account) return undefined
    return (ksmBalancesByAddress[account] || []).map(balance => balance.tokens).reduce(addBigNumbers, undefined)
  }, [account, ksmBalancesByAddress])

  // switch from INIT to IDLE once rpcs found
  useEffect(() => {
    if (!hasRpcs) return
    setStatus(status => (status === 'INIT' ? 'IDLE' : status))
  }, [hasRpcs])

  // update error message as user types
  useEffect(() => {
    const balanceError = 'Account balance too low'
    const setBalanceError = () => setError(balanceError)
    const clearBalanceError = () => setError(error => (error === balanceError ? null : error))

    if (!contributionAmount || contributionAmount === '') return clearBalanceError()
    if (Number.isNaN(Number(contributionAmount))) return clearBalanceError()
    if (ksmBalance === undefined) return clearBalanceError()
    if (new BigNumber(ksmBalance).isLessThan(new BigNumber(contributionAmount))) return setBalanceError()
    clearBalanceError()
  }, [contributionAmount, error, ksmBalance])

  const contribute = useCallback(async () => {
    if (status !== 'IDLE') return

    if (!parachainId) {
      setError('A parachain must be selected')
      return
    }
    if (!contributionAmount || contributionAmount.length < 1) {
      setError('Please enter an amount of KSM')
      return
    }
    if (Number.isNaN(Number(contributionAmount))) {
      setError('Please enter a valid amount of KSM')
      return
    }
    if (!account || account.length < 1) {
      setError('An account must be selected')
      return
    }

    setError(null)
    setExplorerUrl(null)
    setStatus('VALIDATING')

    let api = await apiPromise
    let txStatus
    try {
      const minContribution = api.consts.crowdloan.minContribution as BalanceOf
      const { tokenDecimals } = chaindata
      const contributionPlanck = tokensToPlanck(contributionAmount, tokenDecimals)

      if (!ksmBalance) {
        setStatus('IDLE')
        setError('Account balance not ready yet')
        return
      }
      if (new BigNumber(ksmBalance).isLessThan(new BigNumber(contributionAmount))) {
        setStatus('IDLE')
        setError('Account balance too low')
        return
      }

      // TODO: Test that contribution is above the minContribution
      // TODO: Test that contribution doesn't go above crowdloan cap
      // TODO: Test that crowdloan has not ended
      // TODO: Test that crowdloan is in a valid lease period
      // TODO: Test that crowdloan has not already won
      // TODO: Validate validator signature
      // TODO: Test user has enough KSM to not go below the existential deposit
      // https://github.com/paritytech/polkadot/blob/dee1484760aedfd699e764f2b7c7d85855f7b077/runtime/common/src/crowdloan.rs#L432

      if (
        !contributionPlanck ||
        new BigNumber(contributionPlanck).isLessThan(new BigNumber(minContribution.toString()))
      ) {
        setStatus('IDLE')
        setError(`A minimum of ${planckToTokens(minContribution.toString(), tokenDecimals)} KSM is required`)
        return
      }

      const injector = await web3FromAddress(account)

      const deferred = Deferred<Status>()

      const tx = api.tx.crowdloan.contribute(parachainId, contributionPlanck, signature)

      // TODO: Show fee in UI
      const { partialFee, weight } = await tx.paymentInfo(account)
      console.log(`transaction will have a weight of ${weight}, with ${partialFee.toHuman()} weight fees`)

      const txSigned = await tx.signAsync(account, { signer: injector.signer })

      setStatus('PROCESSING')

      const unsub = await txSigned.send(result => {
        const { status, events = [], dispatchError } = result

        // TODO: Get transaction hash / unique identifier instead of block hash
        // NOTE: Two transactions can both have the same hash
        // To correctly identify a single transation one should use the blockNum and transaction index
        // For more info: https://wiki.polkadot.network/docs/build-protocol-info#unique-identifiers-for-extrinsics

        for (const {
          phase,
          event: { data, method, section },
        } of events) {
          console.info(`\t${phase}: ${section}.${method}:: ${data}`)
        }

        if (status.isInBlock) {
          console.info(`Transaction included at blockHash ${status.asInBlock}`)
          setExplorerUrl(
            `https://polkadot.js.org/apps/${
              chaindata.rpcs[0] ? `?rpc=${encodeURIComponent(chaindata.rpcs[0])}` : ''
            }#/explorer/query/${status.asInBlock}`
          )
        }
        if (status.isFinalized) {
          console.info(`Transaction finalized at blockHash ${status.asFinalized}`)
          unsub()

          let txStatus: Status = 'FAILED'
          if (
            events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess') &&
            !events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed')
          ) {
            txStatus = 'SUCCESS'
          }

          // https://polkadot.js.org/docs/api/cookbook/tx#how-do-i-get-the-decoded-enum-for-an-extrinsicfailed-event
          if (dispatchError && dispatchError.isModule && api) {
            const decoded = api.registry.findMetaError(dispatchError.asModule)
            const { docs, name, section } = decoded
            setError(`${section}.${name}: ${docs.join(' ')}`)
          } else if (dispatchError) {
            setError(dispatchError.toString())
          }

          deferred.resolve(txStatus)
        }
      })

      txStatus = await deferred.promise
    } catch (error) {
      setStatus('IDLE')

      if (typeof error?.message === 'string' && error.message.startsWith('1010:')) {
        setError('Failed to submit transaction: account balance too low')
        return
      }

      console.error('Failed to submit transaction', error)
      setError('Failed to submit transaction')
      return
    }

    setStatus(txStatus)
  }, [account, apiPromise, chaindata, contributionAmount, ksmBalance, parachainId, signature, status])

  return { chaindata, contribute, status, explorerUrl, error }
}

// api is either null or ApiPromise, the promise variation of the polkadotjs api
// apiPromise is a Promise<ApiPromise> which can be `await`ed to wait until the ApiPromise has been initialized
function useApi(rpcs?: string[]): [ApiPromise | null, Promise<ApiPromise>] {
  const [apiPromise, setApiPromise] = useState<Promise<ApiPromise> | null>(null)
  const [api, setApi] = useState<ApiPromise | null>(null)
  const [apiDeferred, setApiDeferred] = useState(Deferred<ApiPromise>())
  const mountedRef = useMountedRef()

  useEffect(() => {
    if (!Array.isArray(rpcs) || rpcs.length < 1) return

    setApiPromise(ApiPromise.create({ provider: new WsProvider(rpcs) }))
  }, [rpcs])

  useEffect(() => {
    if (!apiPromise) return

    apiPromise.then(api => {
      if (!mountedRef.current) return

      // check that we are the most recent api promise
      setApiPromise(currentApiPromise => {
        if (apiPromise === currentApiPromise) setApi(api)
        return currentApiPromise
      })
    })

    return () => {
      apiPromise.then(api => api.disconnect())
    }
  }, [apiPromise, mountedRef])

  useEffect(() => {
    if (!api) return

    setApiDeferred(apiDeferred => {
      // use existing deferred if still pending, otherwise create new deferred
      const deferred = apiDeferred.isPending() ? apiDeferred : Deferred<ApiPromise>()

      // resolve with api
      deferred.resolve(api)

      return deferred
    })
  }, [api])

  return [api, apiDeferred.promise]
}

function useMountedRef() {
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return mountedRef
}
