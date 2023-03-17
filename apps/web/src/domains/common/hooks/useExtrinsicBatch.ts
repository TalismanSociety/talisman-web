import { ApiPromise } from '@polkadot/api'
import { AddressOrPair } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { ISubmittableResult } from '@polkadot/types/types'
import { useCallback, useState } from 'react'
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil'

import { apiState, chainIdState, chainState } from '../../chains/recoils'
import { extrinsicMiddleware } from '../extrinsicMiddleware'
import { toastExtrinsic } from '../utils'

type ExtrinsicMap = PickKnownKeys<{
  // @ts-ignore
  [P in keyof ApiPromise['tx']]: `${P}.${keyof PickKnownKeys<ApiPromise['tx'][P]>}`
}>

type Extrinsic = ExtrinsicMap[keyof ExtrinsicMap]

type ExtrinsicParametersMap = {
  [P in Extrinsic]: P extends `${infer Module}.${infer Section}` ? Parameters<ApiPromise['tx'][Module][Section]> : any
}

/**
 * Mostly a copy of `useExtrinsic`
 * TODO: share code between to 2 hooks
 * @param extrinsics
 * @returns
 */
export const useExtrinsicBatch = <
  TExtrinsics extends [Extrinsic] | Extrinsic[],
  TParams extends { [P in keyof TExtrinsics]: ExtrinsicParametersMap[TExtrinsics[P]] }
>(
  extrinsics: TExtrinsics
) => {
  const chainLoadable = useRecoilValueLoadable(chainState)

  const [loadable, setLoadable] = useState<
    | { state: 'idle'; contents: undefined }
    | { state: 'loading'; contents: ISubmittableResult | undefined }
    | { state: 'hasValue'; contents: ISubmittableResult }
    | { state: 'hasError'; contents: any }
  >({ state: 'idle', contents: undefined })

  const reset = useCallback(() => setLoadable({ state: 'idle', contents: undefined }), [])

  const signAndSend = useRecoilCallback(
    callbackInterface => async (account: AddressOrPair, params: TParams) => {
      const { snapshot } = callbackInterface

      const promiseFunc = async () => {
        const [chainId, api, extension] = await Promise.all([
          snapshot.getPromise(chainIdState),
          snapshot.getPromise(apiState),
          web3FromAddress(account.toString()),
        ])

        let resolve = (value: ISubmittableResult) => {}
        let reject = (value: unknown) => {}

        const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
          resolve = _resolve
          reject = _reject
        })

        const extrinsickeys = extrinsics.map(extrinsic => {
          const [module, section] = extrinsic.split('.')
          return [module!, section!] as const
        })

        try {
          const unsubscribe = await api.tx.utility
            .batchAll(
              extrinsickeys.map(([module, section], index) => api.tx[module]?.[section]?.(...(params[index] ?? []))!)
            )
            .signAndSend(account, { signer: extension?.signer }, result => {
              extrinsickeys.forEach(([module, section], index) =>
                extrinsicMiddleware(
                  chainId,
                  module as any,
                  section as any,
                  account,
                  params[index] ?? [],
                  result,
                  callbackInterface
                )
              )

              if (result.isError) {
                unsubscribe?.()
                reject(result)
              } else if (result.isFinalized) {
                unsubscribe?.()

                const failed = result.events.some(({ event }) => event.method === 'ExtrinsicFailed')

                if (failed) {
                  reject(result)
                } else {
                  resolve(result)
                }
              } else {
                setLoadable({ state: 'loading', contents: result })
              }
            })
        } catch (error) {
          reject(error)
        }

        return deferred
      }

      const promise = promiseFunc()

      setLoadable(loadable => ({
        state: 'loading',
        contents: loadable.state === 'loading' ? loadable.contents : undefined,
      }))

      toastExtrinsic(
        extrinsics.map(extrinsic => {
          const [module, section] = extrinsic.split('.')
          return [module!, section!]
        }),
        promise,
        chainLoadable
      )

      try {
        const result = await promise
        setLoadable({ state: 'hasValue', contents: result })
        return result
      } catch (error) {
        setLoadable({ state: 'hasError', contents: error })
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(extrinsics)]
  )

  return { ...loadable, signAndSend, reset }
}

export default useExtrinsicBatch
