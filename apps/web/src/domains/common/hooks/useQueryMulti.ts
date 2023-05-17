import { type ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
} from '@polkadot/api/types'
import useDeferred from '@util/useDeferred'
import { useEffect, useRef, useState } from 'react'
import { type Loadable, RecoilLoadable, useRecoilValue } from 'recoil'
import { type Observable } from 'rxjs'

import { useSubstrateApiState } from '..'

type QueryMap = PickKnownKeys<// @ts-expect-error
{ [P in keyof ApiPromise['query']]: `${P}.${keyof PickKnownKeys<ApiPromise['query'][P]>}` }>

type Query = QueryMap[keyof QueryMap]

type SingleQueryResultMap = {
  [P in Query]: P extends `${infer Module}.${infer Section}`
    ? Diverge<
        ApiPromise['query'][Module][Section],
        StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
      > extends PromiseResult<(...args: any) => Observable<infer Result>>
      ? Result
      : any
    : never
}

type QueryResultMap = SingleQueryResultMap

type MultiPossibleQuery = keyof QueryResultMap

/**
 * @deprecated use `useChainQueryMulti` instead
 */
export const useQueryMulti = <
  TQueries extends
    | Array<MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]>
    | [MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]]
>(
  queries: TQueries,
  options: { enabled?: boolean; keepPreviousData?: boolean } = { enabled: true, keepPreviousData: false }
) => {
  type TResult = {
    [P in keyof typeof queries]: (typeof queries)[P] extends [infer Head, ...any[]]
      ? Head extends keyof QueryResultMap
        ? QueryResultMap[Head]
        : any
      : (typeof queries)[P] extends keyof QueryResultMap
      ? QueryResultMap[(typeof queries)[P]]
      : any
  }

  const api = useRecoilValue(useSubstrateApiState())

  const { promise, resolve, reject } = useDeferred<TResult>(
    options.keepPreviousData ? undefined : [JSON.stringify(queries)]
  )

  // Reference to be compared, to prevent old promise from resolving after new one
  const promiseRef = useRef(promise)
  useEffect(() => {
    promiseRef.current = promise
  }, [promise])

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

      const params = queries.map(x => {
        if (typeof x === 'string') {
          const [module, section] = x.split('.')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return api.query[module!]?.[section!]
        }

        const [query, ...params] = x
        const [module, section] = query.split('.')

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [api.query[module!]?.[section!], ...params]
      })

      const unsubscribePromise = api
        .queryMulti(params as any, (result: TResult) => {
          if (promise !== promiseRef.current) {
            return
          }

          setLoadable(RecoilLoadable.of(result))
          resolve(result)
        })
        .catch((error: any) => {
          if (promise !== promiseRef.current) {
            return
          }

          setLoadable(RecoilLoadable.error(error))
          reject(error)
        })

      return () => {
        void unsubscribePromise.then(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe()
          }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, options?.enabled, JSON.stringify(queries)]
  )

  return loadable
}

export default useQueryMulti
