// TODO: lots of duplicate type definitions
// but already super burned out, need to de-duplication

import type {
  GenericStorageEntryFunction,
  PromiseResult,
  QueryableStorage,
  QueryableStorageEntry,
  StorageEntryPromiseOverloads,
  UnsubscribePromise,
} from '@polkadot/api/types'
import type { AllDerives } from '@polkadot/api/util'
import { useContext } from 'react'
import { atomFamily, constSelector, isRecoilValue, type RecoilState, type RecoilValueReadOnly } from 'recoil'
import type { Observable } from 'rxjs'
import { ApiIdContext, RecoilStateContext } from './Context.js'
import { garbageCollectionKey } from './GarbageCollector.js'
import type { ApiId, Diverge, Leading, Options, PickKnownKeys } from './types.js'

export const queryAtomFamily = (options: Options) => {
  const _state = atomFamily({
    key: options.key,
    effects: ([apiId, typeName, moduleName, sectionName, params]: [ApiId, string, string, string, any[]]) => [
      ({ setSelf, getPromise }) => {
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

        let initialResolve = (_value: unknown) => {}
        let initialReject = (_reason?: any) => {}

        setSelf(
          new Promise((resolve, reject) => {
            initialResolve = resolve
            initialReject = reject
          })
        )

        const unsubscribePromise = apiPromise.then(async api => {
          const [section, multi] = sectionName.split('.')

          const func =
            // @ts-expect-error
            multi === undefined ? api[typeName][moduleName][section] : api[typeName][moduleName][section][multi]

          const parsedParams = multi === undefined ? params : [params]

          const unsubscribePromise: UnsubscribePromise = func(...parsedParams, (result: any) => {
            initialResolve(result)
            setSelf(result)
          }).catch((error: any) => {
            initialReject(error)
          })

          return await unsubscribePromise
        })

        return () => {
          void unsubscribePromise.then(unsubscribe => unsubscribe())
        }
      },
    ],
    dangerouslyAllowMutability: true,
  })

  const queryState = <
    TModule extends keyof QueryableStorage<'promise'>,
    TSection extends Extract<keyof PickKnownKeys<QueryableStorage<'promise'>[TModule]>, string>,
    TAugmentedSection extends TSection | `${TSection}.multi`,
    TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
    TMethod extends Diverge<
      QueryableStorage<'promise'>[TModule][TExtractedSection],
      StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
    >
  >(
    apiId: ApiId,
    moduleName: TModule,
    sectionName: TAugmentedSection,
    params: TMethod extends (...args: any) => any
      ? TAugmentedSection extends TSection
        ? Leading<Parameters<TMethod>>
        : Leading<Parameters<TMethod>> extends [infer Head]
        ? Head[]
        : Array<Readonly<Leading<Parameters<TMethod>>>>
      : never
  ) =>
    _state([
      apiId,
      'query',
      // @ts-expect-error
      moduleName,
      sectionName,
      params,
    ]) as RecoilState<
      TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
        ? TAugmentedSection extends TSection
          ? Result
          : Result[]
        : never
    >

  const deriveState = <
    TModule extends keyof PickKnownKeys<AllDerives<'promise'>>,
    TSection extends Extract<keyof PickKnownKeys<AllDerives<'promise'>[TModule]>, string>,
    TAugmentedSection extends TSection | `${TSection}.multi`,
    TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
    // @ts-expect-error
    TMethod extends AllDerives<'promise'>[TModule][TExtractedSection]
  >(
    apiId: ApiId,
    moduleName: TModule,
    sectionName: TAugmentedSection,
    params: TMethod extends (...args: any) => any
      ? TAugmentedSection extends TSection
        ? Leading<Parameters<TMethod>>
        : Leading<Parameters<TMethod>> extends [infer Head]
        ? Head[]
        : Array<Readonly<Leading<Parameters<TMethod>>>>
      : never
  ) =>
    _state([apiId, 'derive', moduleName, sectionName, params]) as RecoilState<
      TMethod extends PromiseResult<(...args: any) => Observable<infer Result>>
        ? TAugmentedSection extends TSection
          ? Result
          : Result[]
        : never
    >

  return {
    queryState: Object.assign(queryState, { [garbageCollectionKey]: options.key }),
    deriveState: Object.assign(deriveState, { [garbageCollectionKey]: options.key }),
  }
}

export type QueryState = ReturnType<typeof queryAtomFamily>['queryState']

export type DeriveState = ReturnType<typeof queryAtomFamily>['deriveState']

export const useQueryState = <
  TModule extends keyof QueryableStorage<'promise'>,
  TSection extends Extract<keyof PickKnownKeys<QueryableStorage<'promise'>[TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  TMethod extends Diverge<
    QueryableStorage<'promise'>[TModule][TExtractedSection],
    StorageEntryPromiseOverloads & QueryableStorageEntry<any, any> & PromiseResult<GenericStorageEntryFunction>
  >,
  TEnabled = void
>(
  moduleName: TModule,
  sectionName: TAugmentedSection,
  params: TMethod extends (...args: any) => any
    ? TAugmentedSection extends TSection
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

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilState<undefined>

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  return useContext(RecoilStateContext).queryState(
    useContext(ApiIdContext),
    moduleName,
    sectionName,
    // @ts-expect-error
    params
  ) as TReturn
}

export const useDeriveState = <
  TModule extends keyof PickKnownKeys<AllDerives<'promise'>>,
  TSection extends Extract<keyof PickKnownKeys<AllDerives<'promise'>[TModule]>, string>,
  TAugmentedSection extends TSection | `${TSection}.multi`,
  TExtractedSection extends TAugmentedSection extends `${infer Section}.multi` ? Section : TAugmentedSection,
  // @ts-expect-error
  TMethod extends AllDerives<'promise'>[TModule][TExtractedSection],
  TEnabled = void
>(
  moduleName: TModule,
  sectionName: TAugmentedSection,
  params: TMethod extends (...args: any) => any
    ? TAugmentedSection extends TSection
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

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  type TReturn = TEnabled extends true | void ? TResult : TResult | RecoilValueReadOnly<undefined>

  if (!options.enabled) {
    return constSelector(undefined) as TReturn
  }

  // @ts-expect-error
  return useContext(RecoilStateContext).deriveState(
    useContext(ApiIdContext),
    moduleName,
    sectionName,
    // @ts-expect-error
    params
  ) as TReturn
}
