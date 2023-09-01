import type { ApiPromise } from '@polkadot/api'
import type { RecoilValue } from 'recoil'

export type Diverge<TType, TIntersect> = TType extends infer TDiverge & TIntersect ? TDiverge : TType

export type Leading<T extends any[]> = T extends [...infer Leading, any] ? Leading : []

export type PickKnownKeys<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
}

export type ApiId = undefined | string | number | symbol

export type Options = {
  key: string
  getApi: (id: ApiId) => ApiPromise | PromiseLike<ApiPromise> | RecoilValue<ApiPromise>
}
