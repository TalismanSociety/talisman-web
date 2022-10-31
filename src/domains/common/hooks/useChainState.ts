import { ApiPromise } from '@polkadot/api'
import type {
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
  UnsubscribePromise,
} from '@polkadot/api/types'
import useDeferred from '@util/useDeferred'
import { useEffect, useState } from 'react'
import { Loadable, RecoilLoadable, useRecoilValue } from 'recoil'
import { Observable } from 'rxjs'

import { apiState } from '../../chains/recoils'

export const useChainState = <
  TType extends keyof Pick<ApiPromise, 'query' | 'derive'>,
  TModule extends keyof PickKnownKeys<ApiPromise[TType]>,
  TSection extends Extract<keyof PickKnownKeys<ApiPromise[TType][TModule]>, string>,
  TAugmentedSection extends TType extends 'query' ? TSection | `${TSection}.multi` : TSection,
  TExtractedSection extends TAugmentedSection extends `${infer TSection}.multi` ? TSection : TAugmentedSection,
  TMethod extends Diverge<
    // @ts-ignore
    ApiPromise[TType][TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any>
  >
>(
  typeName: TType,
  moduleName: TModule,
  // @ts-ignore
  sectionName: TAugmentedSection,
  params: TMethod extends (...args: any) => any
    ? // @ts-ignore
      TAugmentedSection extends TSection
      ? Leading<Parameters<TMethod>>
      : Leading<Parameters<TMethod>> extends [infer A]
      ? A[]
      : Array<Readonly<Leading<Parameters<TMethod>>>>
    : never,
  options: { enabled?: boolean; keepPreviousData?: boolean } = { enabled: true, keepPreviousData: false }
) => {
  type TResult = TMethod extends PromiseResult<(...args: any) => Observable<infer TResult>>
    ? TAugmentedSection extends TSection
      ? TResult
      : TResult[]
    : never

  const api = useRecoilValue(apiState)

  const { promise, resolve, reject } = useDeferred<TResult>(
    options.keepPreviousData ? undefined : [typeName, moduleName, sectionName, JSON.stringify(params)]
  )

  const [loadable, setLoadable] = useState<Loadable<TResult>>(RecoilLoadable.of(promise))

  useEffect(() => {
    setLoadable(RecoilLoadable.of(promise))
  }, [promise])

  useEffect(
    () => {
      if (options?.enabled === false) {
        setLoadable(RecoilLoadable.of(promise))
        return
      }

      const [section, multi] = (sectionName as string).split('.')

      const func =
        // @ts-ignore
        multi === undefined ? api[typeName][moduleName][section] : api[typeName][moduleName][section][multi]

      const parsedParams = multi === undefined ? params : [params]

      // @ts-ignore
      const unsubscribePromise: UnsubscribePromise = func(...parsedParams, result => {
        setLoadable(RecoilLoadable.of(result))
        resolve(result)
      }).catch((error: any) => {
        setLoadable(RecoilLoadable.error(error))
        reject(error)
      })

      return () => {
        unsubscribePromise.then(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe()
          }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, typeName, moduleName, sectionName, options?.enabled, JSON.stringify(params)]
  )

  return loadable
}

export default useChainState
