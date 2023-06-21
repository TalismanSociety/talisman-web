import { Chain, Token, chainTokensByIdQuery, supportedChains, useDecodeCallData } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { RawPendingTransaction, rawPendingTransactionsSelector } from '@domains/chains/storage-getters'
import { accountsState } from '@domains/extension'
import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import truncateMiddle from 'truncate-middle'

const { persistAtom } = recoilPersist()

const DUMMY_MULTISIG: Multisig = {
  name: 'DUMMY_MULTISIG',
  chain: supportedChains[0] as Chain,
  signers: [],
  threshold: 0,
  multisigAddress: '',
  proxyAddress: '',
}

export const multisigsState = atom<Multisig[]>({
  key: 'Multisigs',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

// Map of call hashes to their call data and the date the calldata was set
// todo: use the date to clear out really old call data from this cache
export const callDataState = atom<{ [key: string]: [string, Date] }>({
  key: 'CallDataState',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

// Selecting one of these happens in the Overview Header.
export const selectedMultisigState = atom<Multisig>({
  key: 'SelectedMultisig',
  default: DUMMY_MULTISIG,
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

export const selectedMultisigChainTokensState = selector<Token[]>({
  key: 'SelectedMultisigChainTokens',
  get: ({ get }) => {
    const multisig = get(selectedMultisigState)
    const tokens = get(chainTokensByIdQuery(multisig.chain.id))
    return tokens
  },
})

// Returns the next connected signer that needs to sign the transaction,
// or undefined if there are none that can sign
export const useNextTransactionSigner = (approvals: TransactionApprovals | undefined) => {
  const [extensionAccounts] = useRecoilState(accountsState)

  if (!approvals) return
  return extensionAccounts.find(account => approvals[account.address] === false)
}

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
}

export interface Balance {
  token: Token
  amount: BN
}

export interface TransactionRecipient {
  address: string
  balance: Balance
}

export interface TransactionApprovals {
  [key: string]: boolean
}

export interface Transaction {
  description: string
  hash: string
  chainId: string
  approvals: TransactionApprovals
  date: Date
  rawPending?: RawPendingTransaction
  decoded?: {
    type: TransactionType
    recipients: TransactionRecipient[]
    changeMultisigAddressDetails?: {
      signers: string[]
      threshold: number
    }
  }
  callData?: `0x${string}`
}

export const calcSumOutgoing = (t: Transaction): Balance[] => {
  if (!t.decoded) return []

  return t.decoded.recipients.reduce((acc: Balance[], r) => {
    const tokenId = r.balance.token.id
    const existingIndex = acc.findIndex(a => a.token.id === tokenId)
    if (existingIndex !== -1) {
      const existing = acc[existingIndex] as Balance
      const updatedBalance = {
        ...existing,
        amount: existing.amount.add(r.balance.amount),
      }
      acc[existingIndex] = updatedBalance
    } else {
      acc.push({ ...r.balance })
    }
    return acc
  }, [])
}

// transforms raw transaction from the chain into a full Transaction
export const usePendingTransaction = () => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const allRawPending = useRecoilValueLoadable(rawPendingTransactionsSelector)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(selectedMultisig.chain.rpc))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { decodeCallData, loading: decodeCallDataLoading } = useDecodeCallData()
  const [loading, setLoading] = useState(true)
  const [callDataCache, setCallDataCache] = useRecoilState(callDataState)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const ready = allRawPending.state === 'hasValue' && apiLoadable.state === 'hasValue' && !decodeCallDataLoading
  const api = apiLoadable.contents
  const loadTransactions = useCallback(async () => {
    if (!ready) return

    const transactions = await Promise.all(
      allRawPending.contents.map(async rawPending => {
        await api.isReady
        let callData = callDataCache[rawPending.callHash]

        if (!callData) {
          try {
            // Fetch callData from your backend
            // todo: replace with magic calldata sharing

            // todo: cache magic calldata sharing to storage
            // updateCallData(callHash, callData)

            throw Error('unimplemented')

            // eslint-disable-next-line no-unreachable
            setCallDataCache({
              ...callDataCache,
              [rawPending.callHash]: ['0x123', new Date()],
            })
          } catch (error) {
            console.error(`Failed to fetch callData for callHash ${rawPending.callHash}:`, error)
          }
        }

        if (callData) {
          // Assuming you have a createTransaction function
          // const call = decodeCallData(callData[0])
          throw Error('unimplemented')
        } else {
          // still no calldata. return unknown transaction
          return {
            date: rawPending.date,
            description: `Transaction ${truncateMiddle(rawPending.callHash, 6, 4, '...')}`,
            hash: rawPending.callHash,
            rawPending: rawPending,
            chainId: selectedMultisig.chain.id,
            approvals: rawPending.approvals,
          }
        }
      })
    )

    setLoading(false)
    setTransactions(transactions)
  }, [allRawPending, selectedMultisig, callDataCache, setCallDataCache, api.isReady, ready])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  return { loading, transactions }
}

export const EMPTY_BALANCE: Balance = {
  token: {
    id: 'polkadot',
    coingeckoId: 'polkadot',
    logo: 'https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/polkadot.svg',
    type: 'native',
    symbol: 'DOT',
    decimals: 10,
    chain: {
      id: 'polkadot',
    },
  },
  amount: new BN(0),
}
