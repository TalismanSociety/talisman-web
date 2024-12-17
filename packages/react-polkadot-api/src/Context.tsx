import { createContext } from 'react'

import type { DeriveState, QueryState } from './query'
import type { QueryMultiState } from './queryMulti'
import type { ApiId } from './types'

export const ApiIdContext = createContext<ApiId>(undefined)

export const RecoilStateContext = createContext<{
  queryState: QueryState
  deriveState: DeriveState
  queryMultiState: QueryMultiState
}>({
  // @ts-expect-error
  queryState: () => {
    throw new Error('Missing context provider')
  },
  // @ts-expect-error
  deriveState: () => {
    throw new Error('Missing context provider')
  },
  // @ts-expect-error
  queryMultiState: () => {
    throw new Error('Missing context provider')
  },
})
