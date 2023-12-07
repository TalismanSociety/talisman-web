// Abstracting extrinsic calls into these hooks which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { accountsState } from '@domains/extension'
import { Balance, Multisig, Transaction, TxOffchainMetadata } from '@domains/multisig'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import type { Call, ExtrinsicPayload, Timepoint } from '@polkadot/types/interfaces'
import { assert, compactToU8a, u8aConcat, u8aEq } from '@polkadot/util'
import { Address } from '@util/addresses'
import { makeTransactionID } from '@util/misc'
import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'

import { allRawPendingTransactionsSelector, rawPendingTransactionsDependency } from './storage-getters'
import { Chain, isSubstrateAssetsToken, isSubstrateNativeToken, isSubstrateTokensToken, tokenByIdQuery } from './tokens'
import { useInsertTxMetadata } from '../offchain-data/metadata'
import { selectedAccountState } from '../auth'

export const buildTransferExtrinsic = (api: ApiPromise, to: Address, balance: Balance) => {
  if (isSubstrateNativeToken(balance.token)) {
    if (!api.tx.balances?.transferKeepAlive) {
      throw Error('trying to send chain missing balances pallet')
    }
    return api.tx.balances.transferKeepAlive(to.bytes, balance.amount)
  } else if (isSubstrateAssetsToken(balance.token)) {
    if (!api.tx.assets?.transferKeepAlive) {
      throw Error('trying to send chain missing assets pallet')
    }
    return api.tx.assets.transferKeepAlive(balance.token.assetId, to.bytes, balance.amount)
  } else if (isSubstrateTokensToken(balance.token)) {
    if (!api.tx.tokens?.transferKeepAlive) {
      throw Error('trying to send chain missing tokens pallet')
    }
    // tokens requires a string for address not bytes
    return api.tx.tokens.transferKeepAlive(to.bytes, balance.token.onChainId, balance.amount)
  } else {
    throw Error('unknown token type!')
  }
}

// Copied from p.js apps because it's not exported in any public packages.
// Full credit to the p.js team.
// Original code: https://github.com/polkadot-js/apps/blob/b6923ea003e1b043f22d3beaa685847c2bc54c24/packages/page-extrinsics/src/Decoder.tsx#L55
// Inherits Apache-2.0 license.
export const decodeCallData = (api: ApiPromise, callData: string) => {
  try {
    let extrinsicCall: Call
    let extrinsicPayload: ExtrinsicPayload | null = null
    let decoded: SubmittableExtrinsic<'promise'> | null = null

    try {
      // cater for an extrinsic input
      const tx = api.tx(callData)

      // ensure that the full data matches here
      if (tx.toHex() !== callData) {
        throw new Error('Cannot decode data as extrinsic, length mismatch')
      }

      decoded = tx
      extrinsicCall = api.createType('Call', decoded.method)
    } catch {
      try {
        // attempt to decode as Call
        extrinsicCall = api.createType('Call', callData)

        const callHex = extrinsicCall.toHex()

        if (callHex === callData) {
          // all good, we have a call
        } else if (callData.startsWith(callHex)) {
          // this could be an un-prefixed payload...
          const prefixed = u8aConcat(compactToU8a(extrinsicCall.encodedLength), callData)

          extrinsicPayload = api.createType('ExtrinsicPayload', prefixed)

          assert(u8aEq(extrinsicPayload.toU8a(), prefixed), 'Unable to decode data as un-prefixed ExtrinsicPayload')

          extrinsicCall = api.createType('Call', extrinsicPayload.method.toHex())
        } else {
          throw new Error('Unable to decode data as Call, length mismatch in supplied data')
        }
      } catch {
        // final attempt, we try this as-is as a (prefixed) payload
        extrinsicPayload = api.createType('ExtrinsicPayload', callData)

        assert(
          extrinsicPayload.toHex() === callData,
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

    throw Error('unable to decode')
  } catch (e) {
    throw e
  }
}

export const useCancelAsMulti = (tx?: Transaction) => {
  const extensionAddresses = useRecoilValue(accountsState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(tx?.multisig.chain.rpcs || []))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(tx?.multisig.chain.nativeToken.id))
  const setRawPendingTransactionDependency = useSetRecoilState(rawPendingTransactionsDependency)
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  // Only the original signer can cancel
  const depositorAddress: Address | undefined = useMemo(() => {
    const depositorAddressString = tx?.rawPending?.onChainMultisig.depositor.toString()
    if (!depositorAddressString) return undefined
    const depositorAddress = Address.fromSs58(depositorAddressString)
    if (!depositorAddress) throw Error('rawPending multisig depositor is not valid ss52')
    return depositorAddress
  }, [tx?.rawPending?.onChainMultisig.depositor])

  const loading = apiLoadable.state === 'loading' || nativeToken.state === 'loading' || !tx || !depositorAddress
  const canCancel = useMemo(() => {
    if (!depositorAddress) return false

    if (extensionAddresses.some(a => a.address.isEqual(depositorAddress))) return true
    return false
  }, [extensionAddresses, depositorAddress])

  // Creates cancel extrinsic
  const createExtrinsic = useCallback(async (): Promise<SubmittableExtrinsic<'promise'> | undefined> => {
    if (loading) return
    if (!tx.rawPending) throw Error('Missing expected pendingData!')

    const api = apiLoadable.contents
    if (!api.tx.multisig?.cancelAsMulti) {
      throw new Error('chain missing multisig pallet')
    }

    return api.tx.multisig.cancelAsMulti(
      tx.multisig.threshold,
      Address.sortAddresses(tx.multisig.signers)
        .filter(s => !s.isEqual(depositorAddress))
        .map(s => s.bytes),
      tx.rawPending.onChainMultisig.when,
      tx.hash
    )
  }, [apiLoadable, tx, loading, depositorAddress])

  const estimateFee = useCallback(async () => {
    const extrinsic = await createExtrinsic()
    if (!extrinsic || !depositorAddress || !tx) return

    // Fee estimation
    const paymentInfo = await extrinsic.paymentInfo(depositorAddress.toSs58(tx.multisig.chain))
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [depositorAddress, nativeToken, createExtrinsic, tx])

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
      const extrinsic = await createExtrinsic()
      if (loading || !extrinsic || !depositorAddress || !canCancel) {
        console.error('tried to call cancelAsMulti before it was ready')
        return
      }

      const { signer } = await web3FromAddress(depositorAddress.toSs58(tx.multisig.chain))
      extrinsic
        .signAndSend(
          depositorAddress.toSs58(tx.multisig.chain),
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
                  onFailure(JSON.stringify(result.toHuman()))
                }
                if (method === 'ExtrinsicSuccess') {
                  setRawPendingTransactionDependency(new Date())
                  onSuccess(result)
                }
              })
            } else if (result.isError) {
              onFailure(JSON.stringify(result.toHuman()))
            }
          }
        )
        .catch(e => {
          onFailure(JSON.stringify(e))
        })
    },
    [depositorAddress, createExtrinsic, loading, setRawPendingTransactionDependency, canCancel, tx?.multisig.chain]
  )

  return { cancelAsMulti, ready: !loading && !!estimatedFee, estimatedFee, canCancel }
}

export const useAsMulti = (
  extensionAddress: Address | undefined,
  extrinsic: SubmittableExtrinsic<'promise'> | undefined,
  timepoint: Timepoint | null | undefined,
  multisig: Multisig
) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const rawPending = useRecoilValueLoadable(allRawPendingTransactionsSelector)
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(multisig.chain.nativeToken.id))
  const setRawPendingTransactionDependency = useSetRecoilState(rawPendingTransactionsDependency)
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  const ready =
    apiLoadable.state === 'hasValue' &&
    extensionAddress &&
    nativeToken.state === 'hasValue' &&
    !!extrinsic &&
    timepoint !== undefined &&
    rawPending.state === 'hasValue'

  // Creates some tx from calldata
  const createExtrinsic = useCallback(async () => {
    if (!ready) return

    const api = apiLoadable.contents
    if (!api.tx.multisig?.asMulti) {
      throw new Error('chain missing multisig pallet')
    }

    const weightEstimation = (await extrinsic.paymentInfo(extensionAddress.toSs58(multisig.chain))).weight as any

    // Provide some buffer for the weight
    const weight = api.createType('Weight', {
      refTime: api.createType('Compact<u64>', Math.ceil(weightEstimation.refTime * 1.1)),
      proofSize: api.createType('Compact<u64>', Math.ceil(weightEstimation.proofSize * 1.1)),
    })

    return api.tx.multisig.asMulti(
      multisig.threshold,
      Address.sortAddresses(multisig.signers)
        .filter(s => s && !s.isEqual(extensionAddress))
        .map(s => s.bytes),
      timepoint,
      extrinsic.method.toHex(),
      weight
    )
  }, [apiLoadable, extensionAddress, extrinsic, multisig, ready, timepoint])

  const estimateFee = useCallback(async () => {
    const extrinsic = await createExtrinsic()
    if (!extrinsic || !extensionAddress) return

    // Fee estimation
    const paymentInfo = await extrinsic.paymentInfo(extensionAddress.toSs58(multisig.chain))
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [extensionAddress, nativeToken, createExtrinsic, multisig.chain])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const asMulti = useCallback(
    async ({
      onSuccess,
      onFailure,
    }: {
      onSuccess: (r: SubmittableResult) => void
      onFailure: (message: string) => void
    }) => {
      const extrinsic = await createExtrinsic()
      if (!extrinsic || !extensionAddress) {
        console.error('tried to call approveAsMulti before it was ready')
        return
      }

      const { signer } = await web3FromAddress(extensionAddress.toSs58(multisig.chain))
      extrinsic
        .signAndSend(
          extensionAddress.toSs58(multisig.chain),
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
                    onFailure(JSON.stringify(result.toHuman()))
                  }
                  if (method === 'ExtrinsicSuccess') {
                    setRawPendingTransactionDependency(new Date())
                    onSuccess(result)
                  }
                })
            } else if (result.isError) {
              onFailure(JSON.stringify(result.toHuman()))
            }
          }
        )
        .catch(e => {
          onFailure(JSON.stringify(e))
        })
    },
    [extensionAddress, createExtrinsic, setRawPendingTransactionDependency, multisig.chain]
  )

  return { asMulti, ready: ready && !!estimatedFee, estimatedFee }
}

export const useApproveAsMulti = (
  extensionAddress: Address | undefined,
  hash: `0x${string}` | undefined,
  timepoint: Timepoint | null | undefined,
  multisig: Multisig | undefined
) => {
  const signedInAccount = useRecoilValue(selectedAccountState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig?.chain.rpcs || []))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(multisig?.chain.nativeToken.id || null))
  const setRawPendingTransactionDependency = useSetRecoilState(rawPendingTransactionsDependency)
  const insertTxMetadata = useInsertTxMetadata()
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  const ready =
    apiLoadable.state === 'hasValue' &&
    extensionAddress &&
    nativeToken.state === 'hasValue' &&
    !!hash &&
    timepoint !== undefined &&
    multisig !== undefined

  // Creates some tx from callhash
  const createExtrinsic = useCallback(async () => {
    if (!ready) return

    const api = apiLoadable.contents
    if (!api.tx.multisig?.approveAsMulti) {
      throw new Error('chain missing multisig pallet')
    }

    // Weight of approveAsMulti is a noop -- only matters when we execute the tx with asMulti.
    const weight = api.createType('Weight', {
      refTime: api.createType('Compact<u64>', 0),
      proofSize: api.createType('Compact<u64>', 0),
    })
    return api.tx.multisig.approveAsMulti(
      multisig.threshold,
      Address.sortAddresses(multisig.signers)
        .filter(s => !s.isEqual(extensionAddress))
        .map(s => s.bytes),
      timepoint,
      hash,
      weight
    )
  }, [apiLoadable, extensionAddress, hash, multisig, ready, timepoint])

  const estimateFee = useCallback(async () => {
    const extrinsic = await createExtrinsic()
    if (!extrinsic || !extensionAddress || !multisig) return

    // Fee estimation
    const paymentInfo = await extrinsic.paymentInfo(extensionAddress.toSs58(multisig.chain))
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [extensionAddress, nativeToken, createExtrinsic, multisig])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const approveAsMulti = useCallback(
    async ({
      onSuccess,
      onFailure,
      metadata,
    }: {
      onSuccess: (r: SubmittableResult) => void
      onFailure: (message: string) => void
      metadata?: TxOffchainMetadata
    }) => {
      // cache selected account when tx was approved
      const signedInAs = signedInAccount

      const extrinsic = await createExtrinsic()
      if (!extrinsic || !extensionAddress || !hash || !multisig) {
        console.error('tried to call approveAsMulti before it was ready')
        return
      }

      const { signer } = await web3FromAddress(extensionAddress.toSs58(multisig.chain))
      extrinsic
        .signAndSend(
          extensionAddress.toSs58(multisig.chain),
          {
            signer,
          },
          result => {
            if (!result || !result.status) {
              return
            }

            if (result.status.isFinalized) {
              result.events.forEach(async ({ event: { method } }): Promise<void> => {
                if (method === 'ExtrinsicFailed') {
                  onFailure(JSON.stringify(result.toHuman()))
                }
                if (method === 'ExtrinsicSuccess') {
                  // if there's a description, it means we want to post to the metadata service
                  if (metadata) {
                    // @ts-ignore
                    const timepointHeight = result.blockNumber.toNumber() as number
                    const timepointIndex = result.txIndex as number
                    const extrinsicId = makeTransactionID(multisig.chain, timepointHeight, timepointIndex)

                    if (signedInAs) {
                      insertTxMetadata(signedInAs, multisig, {
                        callData: metadata.callData,
                        description: metadata.description,
                        hash,
                        timepointHeight,
                        timepointIndex,
                        changeConfigDetails: metadata.changeConfigDetails,
                        extrinsicId,
                      })
                    }
                  }
                  setRawPendingTransactionDependency(new Date())
                  onSuccess(result)
                }
              })
            } else if (result.isError) {
              onFailure(JSON.stringify(result.toHuman()))
            }
          }
        )
        .catch(e => {
          onFailure(JSON.stringify(e))
        })
    },
    [
      signedInAccount,
      createExtrinsic,
      extensionAddress,
      hash,
      multisig,
      setRawPendingTransactionDependency,
      insertTxMetadata,
    ]
  )

  return { approveAsMulti, ready: ready && !!estimatedFee, estimatedFee }
}

export const useCreateProxy = (chain: Chain, extensionAddress: Address | undefined) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(chain.nativeToken.id))
  const setRawPendingTransactionDependency = useSetRecoilState(rawPendingTransactionsDependency)
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
    const paymentInfo = await tx.paymentInfo(extensionAddress.toSs58(chain))
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [extensionAddress, createTx, nativeToken, chain])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const createProxy = useCallback(
    async ({
      onSuccess,
      onFailure,
    }: {
      onSuccess: (proxyAddress: Address) => void
      onFailure: (message: string) => void
    }) => {
      const tx = await createTx()
      if (!tx || !extensionAddress) return

      const { signer } = await web3FromAddress(extensionAddress.toSs58(chain))

      tx.signAndSend(
        extensionAddress.toSs58(chain),
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
                    const pureStr = data[0].toString()
                    const pure = Address.fromSs58(pureStr)
                    if (!pure) throw Error(`chain returned invalid address ${pureStr}`)
                    setRawPendingTransactionDependency(new Date())
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
                  onFailure(JSON.stringify(result.toHuman()))
                }
              })
          } else if (result.isError) {
            onFailure(JSON.stringify(result.toHuman()))
          }
        }
      ).catch(e => {
        onFailure(e.toString())
      })
    },
    [extensionAddress, createTx, setRawPendingTransactionDependency, chain]
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
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))

  const transferProxyToMultisig = useCallback(
    async (
      extensionAddress: Address | undefined,
      proxyAddress: Address,
      multisigAddress: Address,
      existentialDeposit: Balance,
      onSuccess: (r: SubmittableResult) => void,
      onFailure: (message: string) => void
    ) => {
      if (apiLoadable.state !== 'hasValue' || !extensionAddress) {
        return
      }

      const api = apiLoadable.contents
      const { signer } = await web3FromAddress(extensionAddress.toSs58(chain))

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
        api.tx.proxy.addProxy(multisigAddress.bytes, 'Any', 0),
        api.tx.proxy.removeProxy(extensionAddress.bytes, 'Any', 0),
      ])

      // Define the inner proxy call
      const proxyCall = api.tx.proxy.proxy(proxyAddress.bytes, null, proxyBatchCall)

      // Define the outer batch call
      const signerBatchCall = api?.tx?.utility?.batchAll([
        api.tx.balances.transferKeepAlive(proxyAddress.bytes, getInitialProxyBalance(existentialDeposit).amount),
        proxyCall,
      ])

      // Send the batch call
      signerBatchCall
        .signAndSend(
          extensionAddress.toSs58(chain),
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
                    onFailure(JSON.stringify(result.toHuman()))
                  } else if (event.method === 'ExtrinsicSuccess') {
                    onSuccess(result)
                  }
                })
            } else if (result.isError) {
              onFailure(JSON.stringify(result.toHuman()))
            }
          }
        )
        .catch(e => {
          onFailure(e.toString())
        })
    },
    [apiLoadable, chain]
  )

  return { transferProxyToMultisig, ready: apiLoadable.state === 'hasValue' }
}

// Add 1 whole token onto the ED to make sure there're no weird issues creating the multisig
// TODO: Look into how to compute an exact initial balance.
export const getInitialProxyBalance = (ed: Balance) => ({
  token: ed.token,
  amount: ed.amount.add(new BN(10).pow(new BN(ed.token.decimals))),
})
