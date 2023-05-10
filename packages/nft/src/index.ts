import type * as generators from './generators'
import { type CreateNftAsyncGenerator } from './types'

type NftMap = {
  [P in keyof typeof generators]: (typeof generators)[P] extends CreateNftAsyncGenerator<infer R> ? R : never
}

export type Nft = NftMap[keyof NftMap]

export * from './generators'
