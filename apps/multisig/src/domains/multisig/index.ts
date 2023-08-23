import { Chain, Token, chainTokensByIdQuery, decodeCallData, supportedChains } from '@domains/chains'
import { allPjsApisSelector } from '@domains/chains/pjs-api'
import { RawPendingTransaction, rawPendingTransactionsSelector } from '@domains/chains/storage-getters'
import { accountsState } from '@domains/extension'
import { getTxMetadataByPk } from '@domains/metadata-service'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Address, toMultisigAddress } from '@util/addresses'
import BN from 'bn.js'
import queryString from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import truncateMiddle from 'truncate-middle'

import persistAtom from '../persist'

// create a new atom for deciding whether to show all balances and txns or just for the selected
// multisig
export const combinedViewState = atom<boolean>({
  key: 'CombinedViewState',
  default: false,
  effects_UNSTABLE: [persistAtom],
})

const DUMMY_MULTISIG: Multisig = {
  name: 'DUMMY_MULTISIG',
  chain: supportedChains[0] as Chain,
  signers: [],
  threshold: 0,
  multisigAddress: new Address(new Uint8Array(32)),
  proxyAddress: new Address(new Uint8Array(32)),
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
      return multisig.signers.some(signer => accounts.some(account => account.address.isEqual(signer)))
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
  return extensionAccounts.find(account => approvals[account.address.toPubKey()] === false)
}

export enum TransactionType {
  MultiSend,
  Transfer,
  ChangeConfig,
  Advanced,
}

export interface ChangeConfigDetails {
  newThreshold: number
  newMembers: Address[]
}

export interface TxOffchainMetadata {
  description: string
  callData: `0x${string}`
  changeConfigDetails?: ChangeConfigDetails
}

export interface AugmentedAccount {
  address: Address
  you?: boolean
  nickname?: string
}

export interface Multisig {
  name: string
  chain: Chain
  multisigAddress: Address
  proxyAddress: Address
  signers: Address[]
  threshold: number
}

export interface Balance {
  token: Token
  amount: BN
}

export interface TransactionRecipient {
  address: Address
  balance: Balance
}

export interface TransactionApprovals {
  [key: string]: boolean
}

export interface ExecutedAt {
  block: number
  index: number
  by: Address
}

export interface TransactionDecoded {
  type: TransactionType
  recipients: TransactionRecipient[]
  changeConfigDetails?: {
    signers: Address[]
    threshold: number
  }
}

export interface Transaction {
  description: string
  hash: `0x${string}`
  multisig: Multisig
  approvals: TransactionApprovals
  executedAt?: ExecutedAt
  date: Date
  rawPending?: RawPendingTransaction
  decoded?: TransactionDecoded
  callData?: `0x${string}`
}

export const toConfirmedTxUrl = (t: Transaction) =>
  `https://${t.multisig.chain.chainName}.subscan.io/extrinsic/${t.executedAt?.block}-${t.executedAt?.index}`

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
  multisig: Multisig,
  extrinsic: SubmittableExtrinsic<'promise'>,
  nativeToken: Token,
  changeConfigDetails: ChangeConfigDetails | null
): TransactionDecoded | 'not_ours' => {
  try {
    const { method, section, args } = extrinsic.method

    // If it's not a proxy call, just return advanced
    if (section !== 'proxy' || method !== 'proxy')
      return {
        type: TransactionType.Advanced,
        recipients: [],
      }

    // Got proxy call. Check that it's for our proxy.
    // @ts-ignore
    const proxyString = extrinsic?.method?.toHuman()?.args?.real?.Id
    const proxyAddress = Address.fromSs58(proxyString)
    if (!proxyAddress) throw Error('Chain returned invalid SS58 address for proxy')
    if (!proxyAddress.isEqual(multisig.proxyAddress)) return 'not_ours'

    // Check for Transfer
    let recipients: TransactionRecipient[] = []
    for (const arg of args) {
      const obj: any = arg.toHuman()
      if (obj?.section === 'balances' && obj?.method?.startsWith('transfer')) {
        const destString = obj.args.dest.Id
        const dest = Address.fromSs58(destString)
        if (!dest) throw Error('Chain returned invalid SS58 address for transfer destination')
        recipients.push({
          address: dest,
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

    // Check for MultiSend
    for (const arg of args) {
      const obj: any = arg.toHuman()
      if (obj?.section === 'utility' && obj?.method?.startsWith('batch')) {
        const recipients: (TransactionRecipient | null)[] = obj.args.calls.map((call: any) => {
          if (call.section === 'balances' && call.method?.startsWith('transfer')) {
            const destString = call.args.dest.Id
            const dest = Address.fromSs58(destString)
            if (!dest) throw Error('Chain returned invalid SS58 address for transfer destination')
            return {
              address: dest,
              balance: { token: nativeToken, amount: new BN(call.args.value.replaceAll(',', '')) },
            }
          }
          return null
        })
        if (!recipients.includes(null) && recipients.length > 1) {
          return {
            type: TransactionType.MultiSend,
            recipients: recipients as TransactionRecipient[],
          }
        }
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
        const actualNewMultisigAddress = Address.fromSs58(obj?.args?.calls[0]?.args.delegate.Id)
        if (actualNewMultisigAddress === false) throw Error('got an invalid ss52Address back from the chain!')
        if (!derivedNewMultisigAddress.isEqual(actualNewMultisigAddress)) {
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
export const usePendingTransactions = () => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const combinedView = useRecoilValue(combinedViewState)
  const allRawPending = useRecoilValueLoadable(rawPendingTransactionsSelector)
  const allApisLoadable = useRecoilValueLoadable(allPjsApisSelector)
  const [loading, setLoading] = useState(true)
  const [metadataCache, setMetadataCache] = useRecoilState(txOffchainMetadataState)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    setLoading(true)
  }, [selectedMultisig.multisigAddress, combinedView])

  const ready = allRawPending.state === 'hasValue' && allApisLoadable.state === 'hasValue'
  const loadTransactions = useCallback(async () => {
    if (!ready) return

    const transactions = (
      await Promise.all(
        allRawPending.contents.map(async rawPending => {
          let metadata = metadataCache[rawPending.callHash]

          if (!metadata) {
            try {
              const metadataValues = await getTxMetadataByPk({
                multisig: rawPending.multisig.multisigAddress,
                chain: rawPending.multisig.chain,
                timepoint_height: rawPending.onChainMultisig.when.height.toNumber(),
                timepoint_index: rawPending.onChainMultisig.when.index.toNumber(),
              })

              if (metadataValues) {
                // Validate calldata from the metadata service matches the hash from the chain
                const pjsApi = allApisLoadable.contents[rawPending.multisig.chain.id]
                if (!pjsApi) throw Error(`pjsApi found for rpc ${rawPending.multisig.chain.id}!`)

                const extrinsic = decodeCallData(pjsApi, metadataValues.callData)
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
            const pjsApi = allApisLoadable.contents[rawPending.multisig.chain.id]
            if (!pjsApi) throw Error('Failed to load pjsApi for rpc!')
            const extrinsic = decodeCallData(pjsApi, metadata[0].callData)
            const decoded = extrinsic
              ? extrinsicToDecoded(
                  rawPending.multisig,
                  extrinsic,
                  rawPending.nativeToken,
                  metadata[0].changeConfigDetails || null
                )
              : undefined

            // If decoded returns none, it means the transaction was for a different proxy.
            if (decoded === 'not_ours') return null
            return {
              date: rawPending.date,
              description: metadata[0].description,
              callData: metadata[0].callData,
              hash: rawPending.callHash,
              decoded,
              rawPending: rawPending,
              multisig: rawPending.multisig,
              approvals: rawPending.approvals,
            }
          } else {
            // still no calldata. return unknown transaction
            return {
              date: rawPending.date,
              description: `Transaction ${truncateMiddle(rawPending.callHash, 6, 4, '...')}`,
              hash: rawPending.callHash,
              rawPending: rawPending,
              multisig: rawPending.multisig,
              approvals: rawPending.approvals,
            }
          }
        })
      )
    ).filter(tx => tx !== null)

    setLoading(false)
    setTransactions(transactions as Transaction[])
  }, [allRawPending, metadataCache, setMetadataCache, ready, allApisLoadable.contents])

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
    type: 'substrate-native',
    symbol: 'DOT',
    decimals: 10,
    chain: supportedChains.find(c => c.id === 'polkadot') as Chain,
  },
  amount: new BN(0),
}

export const createImportPath = (name: string, signers: Address[], threshold: number, proxy: Address, chain: Chain) => {
  const params = {
    name,
    signers: signers.map(a => a.toSs58(chain)).join(','),
    threshold,
    proxy: proxy.toSs58(chain),
    chain_id: chain.id,
  }
  return `import?${queryString.stringify(params)}`
}
