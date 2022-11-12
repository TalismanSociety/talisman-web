import { ApiPromise } from '@polkadot/api'
import { AddressOrPair, SubmittableExtrinsics } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import { useCallback, useState } from 'react'
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil'

import { apiState, chainState } from '../../chains/recoils'
import { extensionState } from '../../extension/recoils'
import { extrinsicMiddleWare } from '../extrinsicMiddleware'
import { toastExtrinsic } from '../utils'

export const useExtrinsic = <
  TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
  TSection extends keyof PickKnownKeys<ApiPromise['tx'][TModule]>
>(
  module: TModule,
  section: Extract<keyof SubmittableExtrinsics<'promise'>[TModule], string>
) => {
  type TExtrinsic = ApiPromise['tx'][TModule][TSection]

  const chainLoadable = useRecoilValueLoadable(chainState)

  const [loadable, setLoadable] = useState<
    | { state: 'idle'; contents: undefined }
    | { state: 'loading'; contents: ISubmittableResult | undefined }
    | { state: 'hasValue'; contents: ISubmittableResult }
    | { state: 'hasError'; contents: any }
  >({ state: 'idle', contents: undefined })

  const [parameters, setParameters] = useState<[AddressOrPair, ...Parameters<TExtrinsic>]>()

  const reset = useCallback(() => setLoadable({ state: 'idle', contents: undefined }), [])

  const signAndSend = useRecoilCallback(
    callbackInterface =>
      async (account: AddressOrPair, ...params: Parameters<TExtrinsic>) => {
        const { snapshot } = callbackInterface

        setParameters([account, ...params])

        const promiseFunc = async () => {
          const api = await snapshot.getPromise(apiState)
          const extension = await snapshot.getPromise(extensionState)

          let resolve = (value: ISubmittableResult) => {}
          let reject = (value: unknown) => {}

          const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
            resolve = _resolve
            reject = _reject
          })

          try {
            const unsubscribe = await api.tx[module]?.[section]?.(...params).signAndSend(
              account,
              { signer: extension?.signer },
              result => {
                extrinsicMiddleWare(module, section, result, callbackInterface)

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
              }
            )
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

        toastExtrinsic(module, section as any, promise, chainLoadable)

        try {
          const result = await promise
          setLoadable({ state: 'hasValue', contents: result })
          return result
        } catch (error) {
          setLoadable({ state: 'hasError', contents: error })
        }
      },
    [chainLoadable, module, section]
  )

  return { ...loadable, parameters, signAndSend, reset }
}

export default useExtrinsic
