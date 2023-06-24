import { Chain, Token, chainTokensByIdQuery, supportedChains, tokenByIdQuery, useDecodeCallData } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { RawPendingTransaction, rawPendingTransactionsSelector } from '@domains/chains/storage-getters'
import { accountsState } from '@domains/extension'
import { getTxMetadataByPk } from '@domains/metadata-service'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { toMultisigAddress, toSs52Address } from '@util/addresses'
import BN from 'bn.js'
import queryString from 'query-string'
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

// Map of call hashes to their metadata.
// todo: use the date to clear out really old metadata from this cache
export const txOffchainMetadataState = atom<{ [key: string]: [TxOffchainMetadata, Date] }>({
  key: 'TxOffchainMetadata',
  default: {},
  effects_UNSTABLE: [persistAtom],
})

// Selecting one of these happens in the Overview Header.
export const selectedMultisigState = atom<Multisig>({
  key: 'SelectedMultisig',
  default: DUMMY_MULTISIG,
  effects_UNSTABLE: [persistAtom],
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
  ChangeConfig,
  Advanced,
}

export interface ChangeConfigDetails {
  newThreshold: number
  newMembers: string[]
}

export interface TxOffchainMetadata {
  description: string
  callData: `0x${string}`
  changeConfigDetails?: ChangeConfigDetails
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

export interface TransactionDecoded {
  type: TransactionType
  recipients: TransactionRecipient[]
  changeConfigDetails?: {
    signers: string[]
    threshold: number
  }
}

export interface Transaction {
  description: string
  hash: `0x${string}`
  chain: Chain
  approvals: TransactionApprovals
  date: Date
  rawPending?: RawPendingTransaction
  decoded?: TransactionDecoded
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

export const extrinsicToDecoded = (
  extrinsic: SubmittableExtrinsic<'promise'>,
  nativeToken: Token,
  changeConfigDetails: ChangeConfigDetails | null
): TransactionDecoded => {
  try {
    const { method, section, args } = extrinsic.method
    // If it's not a proxy call, just return advanced
    if (section !== 'proxy' || method !== 'proxy')
      return {
        type: TransactionType.Advanced,
        recipients: [],
      }

    // Got proxy call. Check if it's a Transfer type
    const recipients: TransactionRecipient[] = []
    for (const arg of args) {
      const obj: any = arg.toHuman()
      if (obj?.section === 'balances' && obj?.method?.startsWith('transfer')) {
        recipients.push({
          address: obj.args.dest.Id,
          balance: { token: nativeToken, amount: new BN(obj.args.value.replaceAll(',', '')) },
        })
      }
    }

    if (recipients.length === 1) {
      return {
        type: TransactionType.Transfer,
        recipients,
      }
    }

    // Check if it's a ChangeConfig type
    for (const arg of args) {
      const obj: any = arg.toHuman()
      if (
        changeConfigDetails &&
        obj?.section === 'utility' &&
        obj?.method === 'batchAll' &&
        obj?.args?.calls.length === 2 &&
        obj?.args?.calls[0]?.method === 'addProxy' &&
        obj?.args?.calls[1]?.method === 'removeProxy' &&
        obj.args?.calls[0]?.args?.proxy_type === 'Any' &&
        obj.args?.calls[1]?.args?.proxy_type === 'Any'
      ) {
        // Validate that the metadata 'new configuration' info matches the
        // actual multisig that is being set on chain.
        const derivedNewMultisigAddress = toMultisigAddress(
          changeConfigDetails.newMembers,
          changeConfigDetails.newThreshold
        )
        const actualNewMultisigAddress = toSs52Address(obj?.args?.calls[0]?.args.delegate.Id, null)
        if (derivedNewMultisigAddress !== actualNewMultisigAddress) {
          throw Error("Derived multisig address doesn't match actual multisig address")
        }

        return {
          type: TransactionType.ChangeConfig,
          recipients: [],
          changeConfigDetails: {
            signers: changeConfigDetails.newMembers,
            threshold: changeConfigDetails.newThreshold,
          },
        }
      }
    }
  } catch (error) {}
  return {
    type: TransactionType.Advanced,
    recipients: [],
  }
}

// transforms raw transaction from the chain into a full Transaction
export const usePendingTransaction = () => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const allRawPending = useRecoilValueLoadable(rawPendingTransactionsSelector)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(selectedMultisig.chain.rpc))
  const { decodeCallData, loading: decodeCallDataLoading } = useDecodeCallData()
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(selectedMultisig.chain.nativeToken.id))
  const [loading, setLoading] = useState(true)
  const [metadataCache, setMetadataCache] = useRecoilState(txOffchainMetadataState)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setLoading(true)
  }, [selectedMultisig.multisigAddress])

  const ready =
    allRawPending.state === 'hasValue' &&
    apiLoadable.state === 'hasValue' &&
    !decodeCallDataLoading &&
    nativeToken.state === 'hasValue'
  const api = apiLoadable.contents
  const loadTransactions = useCallback(async () => {
    if (!ready) return

    const transactions = await Promise.all(
      allRawPending.contents.map(async rawPending => {
        await api.isReady
        let metadata = metadataCache[rawPending.callHash]

        if (!metadata) {
          try {
            const metadataValues = await getTxMetadataByPk({
              multisig: selectedMultisig.multisigAddress,
              chain: selectedMultisig.chain.id,
              timepoint_height: rawPending.multisig.when.height.toNumber(),
              timepoint_index: rawPending.multisig.when.index.toNumber(),
            })

            if (metadataValues) {
              // Validate calldata from the metadata service matches the hash from the chain
              const extrinsic = decodeCallData(metadataValues.callData)
              if (!extrinsic) {
                throw new Error(
                  `Failed to create extrinsic from callData recieved from metadata sharing service for hash ${rawPending.callHash}`
                )
              }

              const derivedHash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
              if (derivedHash !== rawPending.callHash) {
                throw new Error(
                  `CallData from metadata sharing service for hash ${rawPending.callHash} does not match hash from chain. Expected ${rawPending.callHash}, got ${derivedHash}`
                )
              }

              console.log(`Loaded metadata for callHash ${rawPending.callHash} from sharing service`)
              metadata = [metadataValues, new Date()]
              setMetadataCache({
                ...metadataCache,
                [rawPending.callHash]: metadata,
              })
            } else {
              console.warn(`Metadata service has no value for callHash ${rawPending.callHash}`)
            }
          } catch (error) {
            console.error(`Failed to fetch callData for callHash ${rawPending.callHash}:`, error)
          }
        }

        if (metadata) {
          // got calldata!
          const extrinsic = decodeCallData(metadata[0].callData)
          const decoded = extrinsic
            ? extrinsicToDecoded(extrinsic, nativeToken.contents, metadata[0].changeConfigDetails || null)
            : undefined
          return {
            date: rawPending.date,
            description: metadata[0].description,
            callData: metadata[0].callData,
            hash: rawPending.callHash,
            decoded,
            rawPending: rawPending,
            chain: selectedMultisig.chain,
            approvals: rawPending.approvals,
          }
        } else {
          // still no calldata. return unknown transaction
          return {
            date: rawPending.date,
            description: `Transaction ${truncateMiddle(rawPending.callHash, 6, 4, '...')}`,
            hash: rawPending.callHash,
            rawPending: rawPending,
            chain: selectedMultisig.chain,
            approvals: rawPending.approvals,
          }
        }
      })
    )

    setLoading(false)
    setTransactions(transactions)
  }, [
    allRawPending,
    selectedMultisig,
    metadataCache,
    setMetadataCache,
    api.isReady,
    ready,
    decodeCallData,
    nativeToken,
  ])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  return { loading, transactions, ready }
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

export const createImportUrl = (name: string, signers: string[], threshold: number, proxy: string, chainId: string) => {
  const params = {
    name,
    signers: signers.join(','),
    threshold,
    proxy,
    chain_id: chainId,
  }
  return `${window.location.origin}/import?${queryString.stringify(params)}`
}
