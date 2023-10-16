import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { Address } from '@util/addresses'
import { atom } from 'recoil'

import persistAtom from '../persist'

export type InjectedAccount = {
  address: Address
} & Omit<InjectedAccountWithMeta, 'address'>

export const accountsState = atom<InjectedAccount[]>({
  key: 'Accounts',
  default: [],
})

export const extensionAllowedState = atom<boolean>({
  key: 'AllowExtension',
  default: false,
  effects_UNSTABLE: [persistAtom],
})

export const extensionLoadingState = atom<boolean>({
  key: 'ExtensionLoading',
  default: false,
})

export const extensionInitiatedState = atom<boolean>({
  key: 'ExtensionInitiated',
  default: false,
})

export { ExtensionWatcher } from './ExtensionWatcher'
