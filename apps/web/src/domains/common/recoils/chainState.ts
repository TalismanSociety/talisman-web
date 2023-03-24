import { apiState } from '@domains/chains/recoils'
import { ApiPromise } from '@polkadot/api'
import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
  UnsubscribePromise,
} from '@polkadot/api/types'
import { RecoilState, atomFamily, errorSelector } from 'recoil'
import { Observable } from 'rxjs'

const chainState = atomFamily({
  key: 'ChainState',
  effects: ([typeName, moduleName, sectionName, params]: [string, string, string, any[]]) => [
    ({ setSelf, getPromise }) => {
      const apiPromise = getPromise(apiState)

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

export const chainQueryState = <
  TModule extends keyof PickKnownKeys<ApiPromise['query']>,
  TSection extends Extract<keyof PickKnownKeys<ApiPromise['query'][TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  TMethod extends Diverge<
    // @ts-ignore
    ApiPromise['query'][TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
  >
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
    : never
) =>
  chainState(['query', String(moduleName), sectionName, params]) as RecoilState<
    TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
      ? TAugmentedSection extends TSection
        ? Result
        : Result[]
      : never
  >

export const chainDeriveState = <
  TModule extends keyof PickKnownKeys<ApiPromise['derive']>,
  TSection extends Extract<keyof PickKnownKeys<ApiPromise['derive'][TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  TMethod extends Diverge<
    // @ts-ignore
    ApiPromise['derive'][TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
  >
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
    : never
) =>
  chainState(['derive', String(moduleName), sectionName, params]) as RecoilState<
    TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
      ? TAugmentedSection extends TSection
        ? Result
        : Result[]
      : never
  >
