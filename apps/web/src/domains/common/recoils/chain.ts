import { ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
  UnsubscribePromise,
} from '@polkadot/api/types'
import { useContext } from 'react'
import { RecoilState, RecoilValueReadOnly, atomFamily, constSelector, errorSelector } from 'recoil'
import { Observable } from 'rxjs'

import { SubstrateApiContext, substrateApiState } from '..'

export const chainState = atomFamily({
  key: 'ChainState',
  effects: ([endpoint, typeName, moduleName, sectionName, params]: [string, string, string, string, any[]]) => [
    ({ setSelf, getPromise }) => {
      const apiPromise = getPromise(substrateApiState(endpoint))

      const unsubscribePromise = apiPromise.then(api => {
        const [section, multi] = (sectionName as string).split('.')

        const func =
          // @ts-ignore
          multi === undefined ? api[typeName][moduleName][section] : api[typeName][moduleName][section][multi]

        const parsedParams = multi === undefined ? params : [params]

        const unsubscribePromise: UnsubscribePromise = func(...parsedParams, (result: any) => {
          setSelf(result)
        }).catch((error: any) => {
          setSelf(errorSelector(error))
        })

        return unsubscribePromise
      })

      return () => {
        unsubscribePromise.then(unsubscribe => unsubscribe())
      }
    },
  ],
  dangerouslyAllowMutability: true,
})

export const useChainQueryState = <
  TModule extends keyof PickKnownKeys<ApiPromise['query']>,
  TSection extends Extract<keyof PickKnownKeys<ApiPromise['query'][TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  TMethod extends Diverge<
    // @ts-ignore
    ApiPromise['query'][TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
  >,
  TEnabled = void
>(
  moduleName: TModule,
  // @ts-ignore
  sectionName: TAugmentedSection,
  params: TMethod extends (...args: any) => any
    ? // @ts-ignore
      TAugmentedSection extends TSection
      ? Leading<Parameters<TMethod>>
      : Leading<Parameters<TMethod>> extends [infer Head]
      ? Head[]
      : Array<Readonly<Leading<Parameters<TMethod>>>>
    : never,
  options: { enabled?: TEnabled } = { enabled: true as TEnabled }
) => {
  type TResult = RecoilState<
    TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
      ? TAugmentedSection extends TSection
        ? Result
        : Result[]
      : never
  >

  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilState<undefined>

  const endpoint = useContext(SubstrateApiContext).endpoint

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  return chainState([endpoint, 'query', String(moduleName), sectionName, params]) as TReturn
}

export const useChainDeriveState = <
  TModule extends keyof PickKnownKeys<ApiPromise['derive']>,
  TSection extends Extract<keyof PickKnownKeys<ApiPromise['derive'][TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  TMethod extends Diverge<
    // @ts-ignore
    ApiPromise['derive'][TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
  >,
  TEnabled = void
>(
  moduleName: TModule,
  sectionName: TAugmentedSection,
  params: TMethod extends (...args: any) => any
    ? // @ts-ignore
      TAugmentedSection extends TSection
      ? Leading<Parameters<TMethod>>
      : Leading<Parameters<TMethod>> extends [infer Head]
      ? Head[]
      : Array<Readonly<Leading<Parameters<TMethod>>>>
    : never,
  options: { enabled?: TEnabled } = { enabled: true as TEnabled }
) => {
  type TResult = RecoilValueReadOnly<
    TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
      ? TAugmentedSection extends TSection
        ? Result
        : Result[]
      : never
  >

  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilValueReadOnly<undefined>

  const endpoint = useContext(SubstrateApiContext).endpoint

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  return chainState([endpoint, 'derive', String(moduleName), sectionName, params]) as any as TReturn
}
