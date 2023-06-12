import type { InjectedAccount } from '@polkadot/extension-inject/types'

export * from './supported-chains'
export * from './extrinsics'
export * from './tokens'

export type Account = InjectedAccount & {
  readonly?: boolean
}
