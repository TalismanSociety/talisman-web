import type * as generators from './generators/index.js'
import { type CreateNftAsyncGenerator } from './types.js'

type NftMap = {
  [P in keyof typeof generators]: (typeof generators)[P] extends CreateNftAsyncGenerator<infer R> ? R : never
}

export type Nft = NftMap[keyof NftMap]

export * from './generators/index.js'
