// Abstracting extrinsic calls into these hooks which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance, selectedMultisigState } from '@domains/multisig'
import { SubmittableResult } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { blake2AsHex, sortAddresses } from '@polkadot/util-crypto'
import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { Chain, tokenByIdQuery } from './tokens'

export const useApproveAsMulti = (extensionAddress: string | undefined, callData: `0x${string}` | undefined) => {
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(multisig.chain.nativeToken.id))
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  // Creates some tx from calldata
  const createTx = useCallback(async () => {
    if (apiLoadable.state !== 'hasValue' || !extensionAddress || nativeToken.state !== 'hasValue' || !callData) {
      return
    }

    const api = apiLoadable.contents
    if (!api.tx.multisig?.approveAsMulti) {
      throw new Error('chain missing multisig pallet')
    }

    // @ts-ignore
    const weightEstimation = (await api.call.transactionPaymentApi.queryInfo(callData, null)).weight

    // Provide some buffer for the weight
    const weight = api.createType('Weight', {
      refTime: api.createType('Compact<u64>', Math.ceil(weightEstimation.refTime * 1.1)),
      proofSize: api.createType('Compact<u64>', Math.ceil(weightEstimation.proofSize * 1.1)),
    })
    const callHash = blake2AsHex(callData)
    return api.tx.multisig.approveAsMulti(
      multisig.threshold,
      sortAddresses(multisig.signers).filter(s => s !== extensionAddress),
      null,
      callHash,
      weight
    )
  }, [apiLoadable, extensionAddress, nativeToken, callData, multisig])

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
    async (onSuccess: () => void, onFailure: (message: string) => void) => {
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
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }): void => {
                if (method === 'ExtrinsicFailed') {
                  onFailure(result.toString())
                }
                if (method === 'ExtrinsicSuccess') {
                  onSuccess()
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
    [extensionAddress, createTx]
  )

  return { approveAsMulti, ready: apiLoadable.state === 'hasValue' && !!estimatedFee, estimatedFee }
}

export const useCreateProxy = (chain: Chain, extensionAddress: string | undefined) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(chain.nativeToken.id))
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
    async (onSuccess: (proxyAddress: string) => void, onFailure: (message: string) => void) => {
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
                  onFailure(result.toString())
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
    [extensionAddress, createTx]
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
        // Add extra planks onto existential deposit to avoid weird 'InsufficientBalance' error
        // TODO: Look into how to compute a more sensible amount to add on.
        api.tx.balances.transferKeepAlive(proxyAddress, existentialDeposit.amount.add(new BN(1_000_000_000))),
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
                    // TODO: make sure this doesnt fire if any inner calls fail
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
