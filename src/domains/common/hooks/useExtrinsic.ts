import { AddressOrPair, AugmentedSubmittables } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import { useCallback, useState } from 'react'
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil'

import { apiState, currentChainState } from '../../chains/recoils'
import { extensionState } from '../../extension/recoils'
import { toastExtrinsic } from '../utils/toast'

type ExtrinsicModules = {
  [P in keyof AugmentedSubmittables<'promise'>]: PickKnownKeys<AugmentedSubmittables<'promise'>[P]>
}

const useExtrinsic = <
  TModuleName extends keyof ExtrinsicModules,
  TMethodName extends keyof ExtrinsicModules[TModuleName]
>(
  module: TModuleName,
  method: TMethodName
) => {
  type TExtrinsic = ExtrinsicModules[TModuleName][TMethodName]

  const chainLoadable = useRecoilValueLoadable(currentChainState)

  const [loadable, setLoadable] = useState<
    | { state: 'idle'; contents: undefined }
    | { state: 'loading'; contents: Promise<any> }
    | { state: 'hasValue'; contents: ISubmittableResult }
    | { state: 'hasError'; contents: any }
  >({ state: 'idle', contents: undefined })

  const reset = useCallback(() => setLoadable({ state: 'idle', contents: undefined }), [])

  const signAndSend = useRecoilCallback(
    ({ snapshot }) =>
      async (account: AddressOrPair, ...params: Parameters<TExtrinsic>) => {
        const promiseFunc = async () => {
          const api = await snapshot.getPromise(apiState)
          const extension = await snapshot.getPromise(extensionState)

          let resolve = (value: ISubmittableResult) => {}
          let reject = (value: unknown) => {}

          const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
            resolve = _resolve
            reject = _reject
          })

          const func = api.tx[module][method].bind(api.tx[module])

          try {
            const unsubscribe = await func(...params).signAndSend(account, { signer: extension?.signer }, result => {
              if (result.isError) {
                unsubscribe()
                reject(result)
              }

              if (result.isFinalized) {
                unsubscribe()

                const failed = result.events.some(({ event }) => event.method === 'ExtrinsicFailed')

                if (failed) {
                  reject(result)
                } else {
                  resolve(result)
                }
              }
            })
          } catch (error) {
            reject(error)
          }

          return deferred
        }

        const promise = promiseFunc()

        setLoadable({ state: 'loading', contents: promise })

        toastExtrinsic(module, method as string, promise, chainLoadable)

        try {
          const result = await promise
          setLoadable({ state: 'hasValue', contents: result })
          return result
        } catch (error) {
          setLoadable({ state: 'hasError', contents: error })
        }
      },
    []
  )

  return { ...loadable, signAndSend, reset }
}

export default useExtrinsic
