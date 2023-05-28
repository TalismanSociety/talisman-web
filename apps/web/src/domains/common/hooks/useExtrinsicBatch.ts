import { ChainContext } from '@domains/chains'
import { type ApiPromise } from '@polkadot/api'
import { type AddressOrPair } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { type ISubmittableResult } from '@polkadot/types/types'
import { useCallback, useContext, useState } from 'react'
import { useRecoilCallback } from 'recoil'
import { substrateApiState, useSubstrateApiEndpoint } from '..'
import { extrinsicMiddleware } from '../extrinsicMiddleware'
import { toastExtrinsic } from '../utils'

type ExtrinsicMap = PickKnownKeys<{
  // @ts-expect-error
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
  const chain = useContext(ChainContext)
  const apiEndpoint = useSubstrateApiEndpoint()

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
        const [api, extension] = await Promise.all([
          snapshot.getPromise(substrateApiState(apiEndpoint)),
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          web3FromAddress(account.toString()),
        ])

        let resolve = (_value: ISubmittableResult) => {}
        let reject = (_value: unknown) => {}

        const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
          resolve = _resolve
          reject = _reject
        })

        const extrinsickeys = extrinsics.map(extrinsic => {
          const [module, section] = extrinsic.split('.')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return [module!, section!] as const
        })

        try {
          const extrinsics = extrinsickeys.map(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
            ([module, section], index) => api.tx[module]?.[section]?.(...(params[index] ?? []))!
          )
          const unsubscribe = await api.tx.utility
            .batchAll(extrinsics)
            .signAndSend(account, { signer: extension?.signer }, result => {
              extrinsics.forEach(extrinsic => extrinsicMiddleware(chain.id, extrinsic, result, callbackInterface))

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

        return await deferred
      }

      const promise = promiseFunc()

      setLoadable(loadable => ({
        state: 'loading',
        contents: loadable.state === 'loading' ? loadable.contents : undefined,
      }))

      toastExtrinsic(
        extrinsics.map(extrinsic => {
          const [module, section] = extrinsic.split('.')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return [module!, section!]
        }),
        promise,
        chain.subscanUrl
      )

      try {
        const result = await promise
        setLoadable({ state: 'hasValue', contents: result })
        return result
      } catch (error) {
        setLoadable({ state: 'hasError', contents: error })
        return undefined
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(extrinsics)]
  )

  return { ...loadable, signAndSend, reset }
}

export default useExtrinsicBatch
