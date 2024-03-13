import { signetAccountState } from '@domains/accounts'
import { chainState, useChainState } from '@domains/chains'
import { useConnectedSubstrateWallet } from '@domains/extension'
import { type ApiPromise } from '@polkadot/api'
import { type AddressOrPair, type SubmittableExtrinsic } from '@polkadot/api/types'
import RpcError from '@polkadot/rpc-provider/coder/error'
import { type ISubmittableResult } from '@polkadot/types/types'
import { useSignetSdk } from '@talismn/signet-apps-sdk'
import { useContext, useMemo, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { substrateApiState, useSubstrateApiEndpoint } from '..'
import { AnalyticsContext } from '../analytics'
import { HarmlessError } from '../errors'
import { extrinsicMiddleware } from '../extrinsicMiddleware'
import { toastExtrinsic } from '../utils'

type Promisable<T> = T | PromiseLike<T>

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

/**
 * @param chainGenesisHash For getting chain info for toast & analytics when extrinsic is built from externally created ApiPromise
 */
export function useExtrinsic<T extends SubmittableExtrinsic<'promise', ISubmittableResult> | undefined>(
  submittable: T,
  chainGenesisHash?: `0x${string}`
): T extends undefined ? ExtrinsicLoadable | undefined : ExtrinsicLoadable
export function useExtrinsic(
  createSubmittable: (api: ApiPromise) => Promisable<SubmittableExtrinsic<'promise', ISubmittableResult> | undefined>
): ExtrinsicLoadable
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
  moduleOrSubmittable:
    | string
    | SubmittableExtrinsic<'promise', ISubmittableResult>
    | ((api: ApiPromise) => Promisable<SubmittableExtrinsic<'promise', ISubmittableResult> | undefined>)
    | undefined,
  sectionOrGenesisHash?: string | `0x${string}`,
  params: unknown[] = []
): ExtrinsicLoadable | undefined {
  const analytics = useContext(AnalyticsContext)
  const contextChain = useRecoilValue(useChainState())
  const endpoint = useSubstrateApiEndpoint()
  const wallet = useConnectedSubstrateWallet()
  const signetAccount = useRecoilValue(signetAccountState)
  const { sdk } = useSignetSdk()
  const [loadable, setLoadable] = useSubmittableResultLoadableState()

  const signAndSend = useRecoilCallback(
    callbackInterface =>
      async (account: AddressOrPair, ...innerParams: unknown[]) => {
        try {
          setLoadable(loadable => ({
            state: 'loading',
            contents: loadable.state === 'loading' ? loadable.contents : undefined,
          }))

          const [submittable, chain] = await (async () => {
            switch (typeof moduleOrSubmittable) {
              case 'string': {
                const api = await callbackInterface.snapshot.getPromise(substrateApiState(endpoint))
                const submittable = api.tx[moduleOrSubmittable]?.[sectionOrGenesisHash ?? '']?.(
                  ...(innerParams.length > 0 ? innerParams : params)
                )

                if (submittable === undefined) {
                  throw new Error(`Unable to construct extrinsic ${moduleOrSubmittable}:${sectionOrGenesisHash ?? ''}`)
                }

                return [submittable, contextChain] as const
              }
              case 'function':
                return [
                  await moduleOrSubmittable(await callbackInterface.snapshot.getPromise(substrateApiState(endpoint))),
                  contextChain,
                ] as const
              default:
                return [
                  moduleOrSubmittable,
                  sectionOrGenesisHash === undefined
                    ? contextChain
                    : await callbackInterface.snapshot.getPromise(chainState({ genesisHash: sectionOrGenesisHash })),
                ]
            }
          })()

          const signingWithSignet = signetAccount?.address === account

          const promiseFunc = async () => {
            let resolve = (_value: ISubmittableResult) => {}
            let reject = (_value: unknown) => {}

            const deferred = new Promise<ISubmittableResult>((_resolve, _reject) => {
              resolve = _resolve
              reject = _reject
            })

            try {
              if (signingWithSignet && submittable) {
                const { ok, error, receipt } = await sdk.send(submittable.method.toHex())

                // both rejects don't matter because signet will toast corresponding message after every transaction
                if (ok && receipt !== undefined) {
                  reject(new Error('Please ignore this message'))
                }

                if (error !== undefined) {
                  reject(new Error('Failed to approve transaction in Signet', { cause: error }))
                }
              }

              const unsubscribe = await submittable?.signAndSend(account, { signer: wallet?.signer }, result => {
                extrinsicMiddleware(chain.id, submittable, result, callbackInterface, {
                  blacklist: analytics.enabled ? [] : ['analytics'],
                })

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

          // Don't toast if using signet sdk because signet cant resolve full ISubmittableResult
          // also signet already handles toasting in its UI
          if (submittable !== undefined && !signingWithSignet) {
            toastExtrinsic([[submittable.method.section, submittable.method.method]], promise, chain.subscanUrl)
          }

          const result = await promise
          setLoadable({ state: 'hasValue', contents: result })
          return result
        } catch (error) {
          setLoadable({ state: 'hasError', contents: error })

          if (
            (error instanceof Error && error.message === 'Cancelled') ||
            // Insufficient fees
            (error instanceof RpcError && error.code === 1010)
          ) {
            throw new HarmlessError(error)
          } else {
            throw error
          }
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      contextChain,
      endpoint,
      moduleOrSubmittable,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(params),
      signetAccount,
      sdk,
      sectionOrGenesisHash,
      setLoadable,
      wallet?.signer,
    ]
  )

  return useMemo(
    () => (moduleOrSubmittable === undefined ? undefined : { ...loadable, signAndSend }),
    [loadable, moduleOrSubmittable, signAndSend]
  )
}

export default useExtrinsic
