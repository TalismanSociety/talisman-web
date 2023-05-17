import { type ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
} from '@polkadot/api/types'
import { useContext } from 'react'
import { type RecoilValueReadOnly, atomFamily, constSelector } from 'recoil'
import { type Observable } from 'rxjs'

import { SubstrateApiContext, substrateApiState } from '..'

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

const _chainQueryMultiState = atomFamily({
  key: 'ChainQueryMulti',
  effects: ({ endpoint, queries }: { endpoint: string; queries: any[] }) => [
    ({ setSelf, getPromise }) => {
      let initialResolve = (_value: unknown) => {}
      let initialReject = (_reason?: any) => {}

      setSelf(
        new Promise((resolve, reject) => {
          initialResolve = resolve
          initialReject = reject
        })
      )

      const unsubscribePromise = getPromise(substrateApiState(endpoint)).then(async api => {
        const params = queries.map(x => {
          if (typeof x === 'string') {
            const [module, section] = x.split('.')
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export const useChainQueryMultiState = <
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

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilValueReadOnly<undefined>

  const endpoint = useContext(SubstrateApiContext).endpoint

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  return _chainQueryMultiState({ endpoint, queries }) as any as TReturn
}
