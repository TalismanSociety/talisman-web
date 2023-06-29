import { type ApiPromise } from '@polkadot/api'
import { type AddressOrPair, type SubmittableExtrinsic } from '@polkadot/api/types'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { type ISubmittableResult } from '@polkadot/types/types'
import { useContext, useMemo, useState } from 'react'
import { useRecoilCallback } from 'recoil'

import { ChainContext } from '@domains/chains'
import { substrateApiState, useSubstrateApiEndpoint } from '..'
import { skipErrorReporting } from '../consts'
import { extrinsicMiddleware } from '../extrinsicMiddleware'
import { toastExtrinsic } from '../utils'

export type SubmittableResultLoadable =
  | { state: 'idle'; contents: undefined }
  | { state: 'loading'; contents: ISubmittableResult | undefined }
  | { state: 'hasValue'; contents: ISubmittableResult }
  | { state: 'hasError'; contents: any }

export type ExtrinsicLoadable = (
  | { state: 'idle'; contents: undefined }
  | { state: 'loading'; contents: ISubmittableResult | undefined }
  | { state: 'hasValue'; contents: ISubmittableResult }
  | { state: 'hasError'; contents: any }
) & {
  signAndSend: (account: AddressOrPair) => Promise<ISubmittableResult>
}

export const useSubmittableResultLoadableState = () =>
  useState<SubmittableResultLoadable>({ state: 'idle', contents: undefined })

export function useExtrinsic<T extends SubmittableExtrinsic<'promise', ISubmittableResult> | undefined>(
  submittable: T
): T extends undefined ? ExtrinsicLoadable | undefined : ExtrinsicLoadable
export function useExtrinsic<
  TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
  TSection extends keyof PickKnownKeys<ApiPromise['tx'][TModule]>
>(
  module: TModule,
  section: TSection
): ExtrinsicLoadable & {
  signAndSend: (
    account: AddressOrPair,
    ...params: Parameters<ApiPromise['tx'][TModule][TSection]>
  ) => Promise<ISubmittableResult>
}
export function useExtrinsic<
  TModule extends keyof PickKnownKeys<ApiPromise['tx']>,
  TSection extends keyof PickKnownKeys<ApiPromise['tx'][TModule]>
>(module: TModule, section: TSection, params: Parameters<ApiPromise['tx'][TModule][TSection]>): ExtrinsicLoadable
export function useExtrinsic(
  moduleOrSubmittable: string | SubmittableExtrinsic<'promise', ISubmittableResult> | undefined,
  section?: string,
  params: unknown[] = []
): ExtrinsicLoadable | undefined {
  const chain = useContext(ChainContext)
  const endpoint = useSubstrateApiEndpoint()

  const [loadable, setLoadable] = useSubmittableResultLoadableState()

  const signAndSend = useRecoilCallback(
    callbackInterface =>
      async (account: AddressOrPair, ...innerParams: unknown[]) => {
        const submittable = await (async () => {
          if (typeof moduleOrSubmittable === 'string') {
            const api = await callbackInterface.snapshot.getPromise(substrateApiState(endpoint))
            const submittable = api.tx[moduleOrSubmittable]?.[section ?? '']?.(
              ...(innerParams.length > 0 ? innerParams : params)
            )

            if (submittable === undefined) {
              throw new Error(`Unable to construct extrinsic ${moduleOrSubmittable}:${section ?? ''}`)
            }

            return submittable
          } else {
            return moduleOrSubmittable
          }
        })()

        const promiseFunc = async () => {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const web3 = await web3FromAddress(account.toString())

          let resolve = (_value: ISubmittableResult) => {}
          let reject = (_value: unknown) => {}

          const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
            resolve = _resolve
            reject = _reject
          })

          try {
            const unsubscribe = await submittable?.signAndSend(account, { signer: web3?.signer }, result => {
              extrinsicMiddleware(chain.id, submittable, result, callbackInterface)

              if (result.isError) {
                unsubscribe?.()
                reject(result)
              } else if (result.isFinalized) {
                unsubscribe?.()

                if (result.dispatchError !== undefined) {
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

        if (submittable !== undefined) {
          toastExtrinsic([[submittable.method.section, submittable.method.method]], promise, chain.subscanUrl)
        }

        try {
          const result = await promise
          setLoadable({ state: 'hasValue', contents: result })
          return result
        } catch (error) {
          setLoadable({ state: 'hasError', contents: error })

          if (error instanceof Error && error.message === 'Cancelled') {
            throw Object.assign(error, { [skipErrorReporting]: true })
          } else {
            throw error
          }
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chain.id, chain.subscanUrl, endpoint, moduleOrSubmittable, JSON.stringify(params), section, setLoadable]
  )

  return useMemo(
    () => (moduleOrSubmittable === undefined ? undefined : { ...loadable, signAndSend }),
    [loadable, moduleOrSubmittable, signAndSend]
  )
}

export default useExtrinsic
