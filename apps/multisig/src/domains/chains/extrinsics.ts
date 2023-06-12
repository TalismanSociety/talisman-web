// Abstracting extrinsic calls into these hooks which will reuse pjs API instances (per network).
// When CAPI is ready, the internals of these hooks can be replaced without needing to make many
// changes in other areas of the codebase.
// TODO: refactor code to remove repititon
// TODO: use pjs types instead of @ts-ignoring everything

import { pjsApiSelector } from '@domains/chains/pjs-api'
import { SubmittableResult } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { useCallback } from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { Chain } from './tokens'

export const useCreateProxy = (chain: Chain) => {
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpc))

  const createProxy = useCallback(
    async (
      extensionAddress: string,
      onSuccess: (proxyAddress: string) => void,
      onFailure: (message: string) => void
    ) => {
      if (apiLoadable.state !== 'hasValue') {
        return
      }

      const api = apiLoadable.contents
      const { signer } = await web3FromAddress(extensionAddress)

      // @ts-ignore
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
                    // @ts-ignore
                    const pure = data[0].toString()
                    onSuccess(pure)
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

  return { createProxy, ready: apiLoadable.state === 'hasValue' }
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
      extensionAddress: string,
      proxyAddress: string,
      multisigAddress: string,
      existentialDeposit: string,
      onSuccess: (r: SubmittableResult) => void,
      onFailure: (message: string) => void
    ) => {
      if (apiLoadable.state !== 'hasValue') {
        return
      }

      const api = apiLoadable.contents
      const { signer } = await web3FromAddress(extensionAddress)

      // Define the inner batch call
      // @ts-ignore
      const proxyBatchCall = api.tx.utility.batchAll([
        // @ts-ignore
        api.tx.proxy.addProxy(multisigAddress, 'Any', 0),
        // @ts-ignore
        api.tx.proxy.removeProxy(extensionAddress, 'Any', 0),
      ])

      // Create the outer call
      // @ts-ignore
      const proxyCall = api.tx.proxy.proxy(proxyAddress, undefined, proxyBatchCall)

      // Define the outer batch call
      // @ts-ignore
      const signerBatchCall = api.tx.utility.batchAll([
        // @ts-ignore
        api.tx.balances.transferKeepAlive(proxyAddress, existentialDeposit),
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
