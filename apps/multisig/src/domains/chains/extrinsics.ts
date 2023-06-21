// Abstracting extrinsic calls into these hooks which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { accountsState } from '@domains/extension'
import { Balance, Transaction, selectedMultisigState } from '@domains/multisig'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { Call, ExtrinsicPayload } from '@polkadot/types/interfaces'
import { assert, compactToU8a, u8aConcat, u8aEq } from '@polkadot/util'
import { sortAddresses } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { rawPendingTransactionsSelector } from './storage-getters'
import { Chain, tokenByIdQuery } from './tokens'

// Sorry, not my code. Copied from p.js apps. it's not exported in any public packages.
// https://github.com/polkadot-js/apps/blob/b6923ea003e1b043f22d3beaa685847c2bc54c24/packages/page-extrinsics/src/Decoder.tsx#L55
export const useDecodeCallData = () => {
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))

  const decodeCallData = useCallback(
    (hex: string) => {
      if (apiLoadable.state !== 'hasValue') return undefined

      const api = apiLoadable.contents as unknown as ApiPromise
      try {
        let extrinsicCall: Call
        let extrinsicPayload: ExtrinsicPayload | null = null
        let decoded: SubmittableExtrinsic<'promise'> | null = null

        try {
          // cater for an extrinsic input
          const tx = api.tx(hex)

          // ensure that the full data matches here
          if (tx.toHex() !== hex) {
            throw new Error('Cannot decode data as extrinsic, length mismatch')
          }

          decoded = tx
          extrinsicCall = api.createType('Call', decoded.method)
        } catch {
          try {
            // attempt to decode as Call
            extrinsicCall = api.createType('Call', hex)

            const callHex = extrinsicCall.toHex()

            if (callHex === hex) {
              // all good, we have a call
            } else if (hex.startsWith(callHex)) {
              // this could be an un-prefixed payload...
              const prefixed = u8aConcat(compactToU8a(extrinsicCall.encodedLength), hex)

              extrinsicPayload = api.createType('ExtrinsicPayload', prefixed)

              assert(u8aEq(extrinsicPayload.toU8a(), prefixed), 'Unable to decode data as un-prefixed ExtrinsicPayload')

              extrinsicCall = api.createType('Call', extrinsicPayload.method.toHex())
            } else {
              throw new Error('Unable to decode data as Call, length mismatch in supplied data')
            }
          } catch {
            // final attempt, we try this as-is as a (prefixed) payload
            extrinsicPayload = api.createType('ExtrinsicPayload', hex)

            assert(
              extrinsicPayload.toHex() === hex,
              'Unable to decode input data as Call, Extrinsic or ExtrinsicPayload'
            )

            extrinsicCall = api.createType('Call', extrinsicPayload.method.toHex())
          }
        }

        if (!decoded) {
          const { method, section } = api.registry.findMetaCall(extrinsicCall.callIndex)
          // @ts-ignore
          const extrinsicFn = api.tx[section][method] as any
          decoded = extrinsicFn(...extrinsicCall.args)

          if (!decoded) throw Error('Unable to decode extrinsic')
          return decoded
        }
      } catch (e) {
        throw e
      }
    },
    [apiLoadable]
  )

  return { loading: apiLoadable.state === 'loading', decodeCallData }
}

export const useCancelAsMulti = (tx: Transaction | undefined) => {
  const multisig = useRecoilValue(selectedMultisigState)
  const extensionAddresses = useRecoilValue(accountsState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(multisig.chain.nativeToken.id))
  const reloadPending = useRecoilRefresher_UNSTABLE(rawPendingTransactionsSelector)
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  // Only the original signer can cancel
  const depositorAddress = tx?.rawPending?.multisig.depositor.toString()
  const loading = apiLoadable.state === 'loading' || nativeToken.state === 'loading' || !tx || !depositorAddress
  const canCancel = useMemo(() => {
    if (!depositorAddress || extensionAddresses.map(a => a.address).includes(depositorAddress)) return true
    return false
  }, [extensionAddresses, depositorAddress])

  // Creates cancel tx
  const createTx = useCallback(async (): Promise<SubmittableExtrinsic<'promise'> | undefined> => {
    if (loading) return
    if (!tx.rawPending) throw Error('Missing expected pendingData!')

    const api = apiLoadable.contents
    if (!api.tx.multisig?.cancelAsMulti) {
      throw new Error('chain missing multisig pallet')
    }

    return api.tx.multisig.cancelAsMulti(
      multisig.threshold,
      sortAddresses(multisig.signers).filter(s => s !== depositorAddress),
      tx.rawPending.multisig.when,
      tx.hash
    )
  }, [apiLoadable, multisig, tx, loading, depositorAddress])

  const estimateFee = useCallback(async () => {
    const tx = await createTx()
    if (!tx || !depositorAddress) return

    // Fee estimation
    const paymentInfo = await tx.paymentInfo(depositorAddress)
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [depositorAddress, nativeToken, createTx])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const cancelAsMulti = useCallback(
    async ({
      onSuccess,
      onFailure,
    }: {
      onSuccess: (r: SubmittableResult) => void
      onFailure: (message: string) => void
    }) => {
      const tx = await createTx()
      if (loading || !tx || !depositorAddress || !canCancel) {
        console.error('tried to call cancelAsMulti before it was ready')
        return
      }

      const { signer } = await web3FromAddress(depositorAddress)
      tx.signAndSend(
        depositorAddress,
        {
          signer,
        },
        result => {
          if (!result || !result.status) {
            return
          }

          if (result.status.isFinalized) {
            result.events.forEach(({ event: { method } }): void => {
              if (method === 'ExtrinsicFailed') {
                onFailure(JSON.stringify(result))
              }
              if (method === 'ExtrinsicSuccess') {
                reloadPending()
                onSuccess(result)
              }
            })
          } else if (result.isError) {
            onFailure(JSON.stringify(result))
          }
        }
      ).catch(e => {
        onFailure(JSON.stringify(e))
      })
    },
    [depositorAddress, createTx, loading, reloadPending, canCancel]
  )

  return { cancelAsMulti, ready: !loading && !!estimatedFee, estimatedFee, canCancel }
}

export const useApproveAsMulti = (
  extensionAddress: string | undefined,
  extrinsic: SubmittableExtrinsic<'promise'> | undefined
) => {
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))
  const rawPending = useRecoilValueLoadable(rawPendingTransactionsSelector)
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(multisig.chain.nativeToken.id))
  const reloadPending = useRecoilRefresher_UNSTABLE(rawPendingTransactionsSelector)
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  const ready =
    apiLoadable.state === 'hasValue' &&
    extensionAddress &&
    nativeToken.state === 'hasValue' &&
    !!extrinsic &&
    rawPending.state === 'hasValue'

  // Creates some tx from calldata
  const createTx = useCallback(async () => {
    if (!ready) return

    const api = apiLoadable.contents
    if (!api.tx.multisig?.approveAsMulti) {
      throw new Error('chain missing multisig pallet')
    }

    const weightEstimation = (await extrinsic.paymentInfo(extensionAddress)).weight as any

    // Provide some buffer for the weight
    const weight = api.createType('Weight', {
      refTime: api.createType('Compact<u64>', Math.ceil(weightEstimation.refTime * 1.1)),
      proofSize: api.createType('Compact<u64>', Math.ceil(weightEstimation.proofSize * 1.1)),
    })
    const hash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
    return api.tx.multisig.approveAsMulti(
      multisig.threshold,
      sortAddresses(multisig.signers).filter(s => s !== extensionAddress),
      null,
      hash,
      weight
    )
  }, [apiLoadable, extensionAddress, extrinsic, multisig, ready])

  const estimateFee = useCallback(async () => {
    const tx = await createTx()
    if (!tx || !extensionAddress) return

    // Fee estimation
    const paymentInfo = await tx.paymentInfo(extensionAddress)
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [extensionAddress, nativeToken, createTx])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const approveAsMulti = useCallback(
    async ({
      onSuccess,
      onFailure,
    }: {
      onSuccess: (r: SubmittableResult) => void
      onFailure: (message: string) => void
    }) => {
      const tx = await createTx()
      if (!tx || !extensionAddress) {
        console.error('tried to call approveAsMulti before it was ready')
        return
      }

      const { signer } = await web3FromAddress(extensionAddress)
      tx.signAndSend(
        extensionAddress,
        {
          signer,
        },
        result => {
          if (!result || !result.status) {
            return
          }

          if (result.status.isFinalized) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }): void => {
                if (method === 'ExtrinsicFailed') {
                  onFailure(JSON.stringify(result))
                }
                if (method === 'ExtrinsicSuccess') {
                  reloadPending()
                  onSuccess(result)
                }
              })
          } else if (result.isError) {
            onFailure(JSON.stringify(result))
          }
        }
      ).catch(e => {
        onFailure(JSON.stringify(e))
      })
    },
    [extensionAddress, createTx, reloadPending]
  )

  return { approveAsMulti, ready: ready && !!estimatedFee, estimatedFee }
}

export const useCreateProxy = (chain: Chain, extensionAddress: string | undefined) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(chain.nativeToken.id))
  const reloadPending = useRecoilRefresher_UNSTABLE(rawPendingTransactionsSelector)
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  const createTx = useCallback(async () => {
    if (apiLoadable.state !== 'hasValue' || !extensionAddress) {
      return
    }

    const api = apiLoadable.contents
    if (!api.tx.proxy?.createPure) {
      throw new Error('chain missing balances or utility or proxy pallet')
    }
    return api.tx.proxy.createPure('Any', 0, 0)
  }, [apiLoadable, extensionAddress])

  const estimateFee = useCallback(async () => {
    const tx = await createTx()
    if (!tx || !extensionAddress || nativeToken.state !== 'hasValue') return

    // Fee estimation
    const paymentInfo = await tx.paymentInfo(extensionAddress)
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [extensionAddress, createTx, nativeToken])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const createProxy = useCallback(
    async ({
      onSuccess,
      onFailure,
    }: {
      onSuccess: (proxyAddress: string) => void
      onFailure: (message: string) => void
    }) => {
      const tx = await createTx()
      if (!tx || !extensionAddress) return

      const { signer } = await web3FromAddress(extensionAddress)

      tx.signAndSend(
        extensionAddress,
        {
          signer,
        },
        result => {
          if (!result || !result.status) {
            return
          }

          if (result.status.isFinalized) {
            result.events
              .filter(({ event: { section } }) => section === 'proxy')
              .forEach(({ event }): void => {
                const { method, data } = event

                if (method === 'PureCreated') {
                  if (data[0]) {
                    const pure = data[0].toString()
                    reloadPending()
                    onSuccess(pure)
                  } else {
                    onFailure('No proxies exist')
                  }
                }
              })

            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }): void => {
                if (method === 'ExtrinsicFailed') {
                  onFailure(JSON.stringify(result))
                }
              })
          } else if (result.isError) {
            onFailure(result.toString())
          }
        }
      ).catch(e => {
        onFailure(e.toString())
      })
    },
    [extensionAddress, createTx, reloadPending]
  )

  return { createProxy, ready: apiLoadable.state === 'hasValue' && !!estimatedFee, estimatedFee }
}

// utils.batchAll(
//   balances.transferKeepAlive(proxyAddress, existentialDeposit)
//   proxy.proxy(proxyAddress, None, call(
//     utils.batchAll(
//       proxy.addProxy(multisigAddress, Any, 0)
//       proxy.removeProxy(setterUppererAddress)
//     )
//   )
// )
export const useTransferProxyToMultisig = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))

  const transferProxyToMultisig = useCallback(
    async (
      extensionAddress: string | undefined,
      proxyAddress: string,
      multisigAddress: string,
      existentialDeposit: Balance,
      onSuccess: (r: SubmittableResult) => void,
      onFailure: (message: string) => void
    ) => {
      if (apiLoadable.state !== 'hasValue' || !extensionAddress) {
        return
      }

      const api = apiLoadable.contents
      const { signer } = await web3FromAddress(extensionAddress)

      if (
        !api.tx.balances?.transferKeepAlive ||
        !api.tx.utility?.batchAll ||
        !api.tx.proxy?.proxy ||
        !api.tx.proxy?.addProxy ||
        !api.tx.proxy?.removeProxy
      ) {
        throw new Error('chain missing balances or utility or proxy pallet')
      }

      // Define the inner batch call
      const proxyBatchCall = api.tx.utility.batchAll([
        api.tx.proxy.addProxy(multisigAddress, 'Any', 0),
        api.tx.proxy.removeProxy(extensionAddress, 'Any', 0),
      ])

      // Define the inner proxy call
      const proxyCall = api.tx.proxy.proxy(proxyAddress, undefined, proxyBatchCall)

      // Define the outer batch call
      const signerBatchCall = api?.tx?.utility?.batchAll([
        api.tx.balances.transferKeepAlive(proxyAddress, getInitialProxyBalance(existentialDeposit).amount),
        proxyCall,
      ])

      // Send the batch call
      signerBatchCall
        .signAndSend(
          extensionAddress,
          {
            signer,
          },
          result => {
            if (!result || !result.status) {
              return
            }

            if (result.status.isFinalized) {
              result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event }): void => {
                  if (event.method === 'ExtrinsicFailed') {
                    onFailure(result.toString())
                  } else if (event.method === 'ExtrinsicSuccess') {
                    onSuccess(result)
                  }
                })
            } else if (result.isError) {
              onFailure(result.toString())
            }
          }
        )
        .catch(e => {
          onFailure(e.toString())
        })
    },
    [apiLoadable]
  )

  return { transferProxyToMultisig, ready: apiLoadable.state === 'hasValue' }
}

// Add 1 whole token onto the ED to make sure there're no weird issues creating the multisig
// TODO: Look into how to compute an exact initial balance.
export const getInitialProxyBalance = (ed: Balance) => ({
  token: ed.token,
  amount: ed.amount.add(new BN(10).pow(new BN(ed.token.decimals))),
})
