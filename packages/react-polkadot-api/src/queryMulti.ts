/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiIdContext, RecoilStateContext } from './Context.js'
import { garbageCollectionKey } from './GarbageCollector.js'
import type { ApiId, Diverge, Options, PickKnownKeys } from './types.js'
import { type ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
} from '@polkadot/api/types'
import { useContext } from 'react'
import { atomFamily, constSelector, isRecoilValue, type RecoilValueReadOnly } from 'recoil'
import { type Observable } from 'rxjs'

type QueryMap = PickKnownKeys<{
  [P in keyof ApiPromise['query']]: `${P}.${keyof PickKnownKeys<ApiPromise['query'][P]>}`
}>

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

export const queryMultiAtomFamily = (options: Options) => {
  const _state = atomFamily({
    key: 'ChainQueryMulti',
    effects: ({ apiId, queries }: { apiId: ApiId; queries: any[] }) => [
      ({ setSelf, getPromise }) => {
        let initialResolve = (_value: unknown) => {}
        let initialReject = (_reason?: any) => {}

        setSelf(
          new Promise((resolve, reject) => {
            initialResolve = resolve
            initialReject = reject
          })
        )

        const maybeApi = options.getApi(apiId)

        const apiPromise = (async () => {
          if (isRecoilValue(maybeApi)) {
            return await getPromise(maybeApi)
          }

          if ('then' in maybeApi) {
            return await maybeApi
          }

          return maybeApi
        })()

        const unsubscribePromise = apiPromise.then(async api => {
          const params = queries.map(x => {
            if (typeof x === 'string') {
              const [module, section] = x.split('.')

              return api.query[module!]?.[section!]
            }

            const [query, ...params] = x
            const [module, section] = query.split('.')

            return [api.query[module]?.[section], ...params]
          })

          return await api
            .queryMulti(params as any, result => {
              initialResolve(result)
              setSelf(result)
            })
            .catch((error: any) => {
              initialReject(error)
            })
        })

        return () => {
          void unsubscribePromise.then(unsubscribe => {
            if (typeof unsubscribe === 'function') {
              unsubscribe()
            }
          })
        }
      },
    ],
    dangerouslyAllowMutability: true,
  })

  return Object.assign(
    <
      TQueries extends
        | Array<MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]>
        | [MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]]
    >(
      apiId: ApiId,
      queries: TQueries
    ) => _state({ apiId, queries }),
    { [garbageCollectionKey]: options.key }
  )
}

export type QueryMultiState = ReturnType<typeof queryMultiAtomFamily>

export const useQueryMultiState = <
  TQueries extends
    | Array<MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]>
    | [MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]],
  TEnabled = void
>(
  queries: TQueries,
  options: { enabled?: TEnabled } = { enabled: true as TEnabled }
) => {
  type TResult = RecoilValueReadOnly<{
    [P in keyof TQueries]: TQueries[P] extends [infer Head, ...any[]]
      ? Head extends keyof QueryResultMap
        ? QueryResultMap[Head]
        : any
      : TQueries[P] extends keyof QueryResultMap
      ? QueryResultMap[TQueries[P]]
      : any
  }>

  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilValueReadOnly<undefined>

  const recoilState = useContext(RecoilStateContext)
  const apiId = useContext(ApiIdContext)

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  return recoilState.queryMultiState(apiId, queries) as any as TReturn
}
