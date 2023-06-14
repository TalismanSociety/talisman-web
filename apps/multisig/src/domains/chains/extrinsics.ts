// Abstracting extrinsic calls into these hooks which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { Balance } from '@domains/multisig'
import { SubmittableResult } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { Chain, tokenByIdQuery } from './tokens'

export const useCreateProxy = (chain: Chain, extensionAddress: string | undefined) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(chain.nativeToken.id))
  const [estimatedFee, setEstimatedFee] = useState<Balance | undefined>()

  const estimateFee = useCallback(async () => {
    if (apiLoadable.state !== 'hasValue' || !extensionAddress || nativeToken.state !== 'hasValue') {
      return
    }

    const api = apiLoadable.contents
    if (!api.tx.proxy?.createPure) {
      throw new Error('chain missing balances or utility or proxy pallet')
    }
    const tx = api.tx.proxy.createPure('Any', 0, 0)

    // Fee estimation
    const paymentInfo = await tx.paymentInfo(extensionAddress)
    setEstimatedFee({ token: nativeToken.contents, amount: paymentInfo.partialFee as unknown as BN })
  }, [apiLoadable, extensionAddress, nativeToken])

  // Estimate the fee as soon as the hook is used and the extensionAddress or apiLoadable changes
  useEffect(() => {
    estimateFee()
  }, [estimateFee])

  const createProxy = useCallback(
    async (
      extensionAddress: string | undefined,
      onSuccess: (proxyAddress: string) => void,
      onFailure: (message: string) => void
    ) => {
      if (apiLoadable.state !== 'hasValue' || !extensionAddress) {
        return
      }

      const api = apiLoadable.contents
      const { signer } = await web3FromAddress(extensionAddress)

      if (!api.tx.proxy?.createPure) {
        throw new Error('chain missing balances or utility or proxy pallet')
      }

      api.tx.proxy
        .createPure('Any', 0, 0)
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
        )
        .catch(e => {
          onFailure(e.toString())
        })
    },
    [apiLoadable]
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
        !api.tx.balances?.transfer ||
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
        api.tx.balances.transfer(proxyAddress, existentialDeposit.amount.add(new BN(1_000_000_000))),
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
