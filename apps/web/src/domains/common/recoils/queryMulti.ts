import { apiState } from '@domains/chains/recoils'
import { ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
} from '@polkadot/api/types'
import { RecoilState, atomFamily, errorSelector } from 'recoil'
import { Observable } from 'rxjs'

type QueryMap = PickKnownKeys<// @ts-ignore
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

const _chainQueryMultiState = atomFamily({
  key: 'ChainQueryMulti',
  effects: (queries: any[]) => [
    ({ setSelf, getPromise }) => {
      const unsubscribePromise = getPromise(apiState).then(api => {
        const params = queries.map(x => {
          if (typeof x === 'string') {
            const [module, section] = x.split('.')
            return api.query[module!]?.[section!]
          }

          const [query, ...params] = x
          const [module, section] = query.split('.')

          return [api.query[module!]?.[section!], ...params]
        })

        return api
          .queryMulti(params as any, result => {
            setSelf(result)
          })
          .catch((error: any) => {
            setSelf(errorSelector(error))
          })
      })

      return () => {
        unsubscribePromise.then(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe()
          }
        })
      }
    },
  ],
  dangerouslyAllowMutability: true,
})

export const chainQueryMultiState = <
  TQueries extends
    | Array<MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]>
    | [MultiPossibleQuery | [MultiPossibleQuery, ...unknown[]]]
>(
  queries: TQueries
) => {
  return _chainQueryMultiState(queries as any) as RecoilState<{
    [P in keyof TQueries]: TQueries[P] extends [infer Head, ...any[]]
      ? Head extends keyof QueryResultMap
        ? QueryResultMap[Head]
        : any
      : TQueries[P] extends keyof QueryResultMap
      ? QueryResultMap[TQueries[P]]
      : any
  }>
}
