import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { BalanceOf } from '@polkadot/types/interfaces'
import { useChain } from '@talismn/api-react-hooks'
import { Deferred, planckToTokens, tokensToPlanck } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { useCallback, useMemo, useState } from 'react'

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

  useEffect(() => {
    if (!hasRpcs) return
    setStatus(status => (status === 'INIT' ? 'IDLE' : status))
  }, [hasRpcs])

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
    if (parseFloat(contributionAmount).toString() !== contributionAmount) {
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

    let api: ApiPromise | undefined = undefined
    let txStatus
    try {
      api = await ApiPromise.create({ provider: new WsProvider(chaindata.rpcs), throwOnConnect: true })

      const minContribution = api.consts.crowdloan.minContribution as BalanceOf
      const { tokenDecimals } = chaindata
      const contributionPlanck = tokensToPlanck(contributionAmount, tokenDecimals)

      // TODO: Test that contribution is above the minContribution
      // TODO: Test that contribution doesn't go above crowdloan cap
      // TODO: Test that crowdloan has not ended
      // TODO: Test that crowdloan is in a valid lease period
      // TODO: Test that crowdloan has not already won
      // TODO: Validate validator signature
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
          setExplorerUrl(`https://polkadot.js.org/apps/#/explorer/query/${status.asInBlock}`)
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
      api && api.disconnect()
      setStatus('IDLE')

      if (typeof error?.message === 'string' && error.message.startsWith('1010:')) {
        setError('Failed to submit transaction: account balance too low')
        return
      }

      console.error('Failed to submit transaction', error)
      setError('Failed to submit transaction')
      return
    }

    api && api.disconnect()
    setStatus(txStatus)
  }, [account, chaindata, contributionAmount, parachainId, signature, status])

  return { chaindata, contribute, status, explorerUrl, error }
}
