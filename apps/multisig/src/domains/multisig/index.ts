import { Chain, Token } from '@domains/chains'
import { accountsState } from '@domains/extension'
import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const multisigsState = atom<Multisig[]>({
  key: 'Multisigs',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export const userSelectedMultisigState = atom<Multisig | undefined>({
  key: 'UserSelectedMultisig',
  default: undefined,
})

export const activeMultisigsState = selector({
  key: 'ActiveMultisigs',
  get: ({ get }) => {
    const multisigs = get(multisigsState)
    const accounts = get(accountsState)

    return multisigs.filter(multisig => {
      return multisig.signers.some(signer => accounts.some(account => account.address === signer))
    })
  },
})

export const selectedMultisigState = selector<Multisig>({
  key: 'SelectedMultisig',
  get: ({ get }) => {
    const userSelected = get(userSelectedMultisigState)
    if (userSelected !== undefined) {
      return userSelected
    }

    const activeMultisigs = get(activeMultisigsState)
    if (activeMultisigs.length > 0) {
      return activeMultisigs[0] as Multisig
    } else {
      console.error('No active multisigs found!')
      throw Error('No active multisigs found!')
    }
  },
})

export enum TransactionType {
  MultiSend,
  Transfer,
  Advanced,
}

export interface AugmentedAccount {
  address: string
  you?: boolean
  nickname?: string
}

export interface Multisig {
  name: string
  chain: Chain
  multisigAddress: string
  proxyAddress: string
  signers: string[]
  threshold: number
  balances: Balance[]
  pendingTransactions: Transaction[]
  confirmedTransactions: Transaction[]
}

export interface Balance {
  token: Token
  amount: string
}

interface TransactionRecipient {
  address: string
  balance: Balance
}

export interface Transaction {
  multisig: Multisig
  createdTimestamp: Date
  executedTimestamp?: Date
  description: string
  hash: string
  chainId: number
  approvals: {
    [key: string]: string | undefined
  }
  decoded: {
    type: TransactionType
    recipients: TransactionRecipient[]
    yaml: string
    changeMultisigAddressDetails?: {
      signers: string[]
      threshold: number
    }
  }
  raw: string
}
