import { atom } from 'recoil'
import { InjectedAccount } from '../extension'
import persistAtom from '../persist'

type SignedInAccount = {
  accessToken: string
  injectedAccount: InjectedAccount
}

export const SelectedAccountState = atom<SignedInAccount | null>({
  key: 'SelectedAccount',
  default: null,
})

export const SignedInAccountsState = atom<SignedInAccount[]>({
  key: 'SignedInAccounts',
  default: [],
  effects_UNSTABLE: [persistAtom],
})
