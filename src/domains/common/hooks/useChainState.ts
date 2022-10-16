import { ApiPromise } from '@polkadot/api'
import type { PromiseResult, QueryableStorageEntry, StorageEntryPromiseOverloads } from '@polkadot/api/types'
import useDeferred from '@util/useDeferred'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Observable } from 'rxjs'

import { apiState } from '../../chains/recoils'

const useChainState = <
  TType extends keyof Pick<ApiPromise, 'query' | 'derive'>,
  TModule extends keyof PickKnownKeys<ApiPromise[TType]>,
  TSection extends keyof PickKnownKeys<ApiPromise[TType][TModule]>,
  TMethod extends Diverge<
    ApiPromise[TType][TModule][TSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any>
  >
>(
  typeName: TType,
  moduleName: TModule,
  // @ts-ignore
  sectionName: TType extends 'query' ? TSection | `${TSection}.multi` : TSection,
  params: TMethod extends (...args: any) => any
    ? // @ts-ignore
      `${TSection}.multi` extends typeof sectionName
      ? Leading<Parameters<TMethod>> extends [infer A]
        ? A[]
        : Array<Readonly<Leading<Parameters<TMethod>>>>
      : Leading<Parameters<TMethod>>
    : never
) => {
  type TResult = TMethod extends PromiseResult<(...args: any) => Observable<infer TResult>>
    ? // @ts-ignore
      `${TSection}.multi` extends typeof sectionName
      ? TResult[]
      : TResult
    : never

  const api = useRecoilValue(apiState)

  const { promise, resolve, reject } = useDeferred<TResult>()

  const [loadable, setLoadable] = useState<
    | { state: 'loading'; contents: Promise<TResult> }
    | { state: 'hasValue'; contents: TResult }
    | { state: 'hasError'; contents: any }
  >({ state: 'loading', contents: promise })

  useEffect(
    () => {
      const [section, multi] = (sectionName as string).split('.')

      const func =
        // @ts-ignore
        multi === undefined ? api[typeName][moduleName][section] : api[typeName][moduleName][section][multi]

      const parsedParams = multi === undefined ? params : [params]

      // @ts-ignore
      const unsubscribePromise: Promise<() => void> = func(...parsedParams, result => {
        setLoadable({ state: 'hasValue', contents: result })
        resolve(result)
      }).catch((error: any) => {
        setLoadable({ state: 'hasError', contents: error })
        reject(error)
      })

      return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe())
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [api.derive, moduleName, sectionName, JSON.stringify(params)]
  )

  return loadable
}

export default useChainState
