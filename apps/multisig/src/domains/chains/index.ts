import type { InjectedAccount } from '@polkadot/extension-inject/types'

export * from './supported-chains'
export * from './extrinsics'
export * from './constant-getters'
export * from './tokens'
export * from './useNativeToken'

export type Account = InjectedAccount & {
  readonly?: boolean
}
