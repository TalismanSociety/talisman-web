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

export const activeMultisigsState = selector({
  key: 'ActiveMultisigs',
  get: ({ get }) => {
    const multisigs = get(multisigsState)
    const accounts = get(accountsState)

    return multisigs.filter(multisig =>
      multisig.signers.some(signer => accounts.some(account => account.address === signer))
    )
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
