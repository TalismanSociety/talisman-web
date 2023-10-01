import { allChainTokensSelector, decodeCallData } from '@domains/chains'
import { allPjsApisSelector } from '@domains/chains/pjs-api'
import { getTxMetadataByPk } from '@domains/metadata-service'
import { SignedBlock } from '@polkadot/types/interfaces'
import {
  ExecutedAt,
  Multisig,
  Transaction,
  activeMultisigsState,
  combinedViewState,
  extrinsicToDecoded,
  selectedMultisigState,
  txOffchainMetadataState,
} from '@domains/multisig'
import { Address } from '@util/addresses'
import { makeTransactionID } from '@util/misc'
import { gql } from 'graphql-request'
import { useCallback, useEffect, useState } from 'react'
import { atom, selector, selectorFamily, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import fetchGraphQL from '../../graphql/fetch-graphql'

interface RawResponse {
  data: {
    extrinsics: {
      fee: string
      indexInBlock: number
      block: {
        timestamp: string
        blockHash: string
      }
    }[]
  }
}

// Change this value to the current date to trigger a reload of confirmed txs
export const rawConfirmedTransactionsDependency = atom<Date>({
  key: 'RawConfirmedTransactionsDependency',
  default: new Date(),
})

type Variables = {
  signer_in: string[]
  chain_id: string
}

export const rawConfirmedTransactionsSelector = selectorFamily({
  key: 'rawConfirmedTransactionsSelector',
  get:
    ({ chain_id, signer_in }: Variables) =>
    async ({ get }): Promise<RawResponse> => {
      // This dependency allows effectively clearing the cache of this selector
      get(rawConfirmedTransactionsDependency)

      const query = gql`
        query ConfirmedTransactions($signer_in: [String!], $chain_id: String!) {
          extrinsics(
            where: {
              call: { data_jsonContains: "{\\"name\\":\\"Multisig.as_multi\\"}", block: { chainId_eq: $chain_id } }
              signer_in: $signer_in
            }
          ) {
            signer
            fee
            block {
              timestamp
              blockHash
            }
            indexInBlock
          }
        }
      `

      const variables = {
        signer_in,
        chain_id,
      }

      return fetchGraphQL(query, variables, 'tx-history') as Promise<RawResponse>
    },
})

export const allRawConfirmedTransactionsSelector = selector({
  key: 'AllRawConfirmedTransactionsSelector',
  get: async ({ get }): Promise<[RawResponse, Multisig][]> => {
    const selectedMultisig = get(selectedMultisigState)
    const activeMultisigs = get(activeMultisigsState)
    const combinedView = get(combinedViewState)

    const multisigs = combinedView ? activeMultisigs : [selectedMultisig]
    const rawResponses = multisigs.map(multisig => {
      const responses = get(
        rawConfirmedTransactionsSelector({
          signer_in: multisig.signers.map(s => s.toPubKey()),
          chain_id: multisig.chain.squidIds.txHistory,
        })
      )
      return [responses, multisig] as [RawResponse, Multisig]
    })

    return rawResponses
  },
})

const blockCache = new Map<string, SignedBlock>()

// fetches the raw txs from squid
export const useConfirmedTransactions = () => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const allApisLoadable = useRecoilValueLoadable(allPjsApisSelector)
  const allActiveChainTokens = useRecoilValueLoadable(allChainTokensSelector)
  const [metadataCache, setMetadataCache] = useRecoilState(txOffchainMetadataState)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const rawConfirmedTransactionsResponses = useRecoilValueLoadable(allRawConfirmedTransactionsSelector)
  const combinedView = useRecoilValue(combinedViewState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [selectedMultisig.multisigAddress, combinedView])

  const ready =
    allApisLoadable.state === 'hasValue' &&
    rawConfirmedTransactionsResponses.state === 'hasValue' &&
    allActiveChainTokens.state === 'hasValue'

  const loadTransactions = useCallback(async () => {
    if (!ready) return
    const promises = rawConfirmedTransactionsResponses.contents
      .map(([rawResponse, curMultisig]) => {
        const curChainTokens = allActiveChainTokens.contents.get(curMultisig.chain.squidIds.chainData)
        if (!curChainTokens)
          throw Error(`tokens not found in allActiveChainTokens for chain ${JSON.stringify(curMultisig.chain)}!`)

        const api = allApisLoadable.contents.get(curMultisig.chain.squidIds.chainData)
        if (!api) throw Error(`api not found in allApisLoadable for rpc ${curMultisig.chain.squidIds.chainData}!`)

        return rawResponse.data.extrinsics.map(async r => {
          const block = blockCache.get(r.block.blockHash) || (await api.rpc.chain.getBlock(r.block.blockHash))
          blockCache.set(r.block.blockHash, block)
          const timestamp = r.block.timestamp
          // fetch the outer ext
          const ext = block.block.extrinsics[r.indexInBlock]
          if (!ext) throw Error("couldn't find extrinsic in block")
          // inner ext is 3rd arg
          const innerExt = ext.method.args[3]
          // @ts-ignore
          if (innerExt?.toHuman()?.method !== 'proxy' || innerExt?.toHuman()?.section !== 'proxy') return null
          const callData = innerExt?.toHex()
          if (callData) {
            // pull the timepoint and timepoint index out of the original ext
            const timepoint = ext.method.args[2]?.toHuman() as { height: string; index: string } | null
            // no timepoint means this was not an execution
            if (!timepoint) return null

            const decodedExt = decodeCallData(api, callData)
            if (!decodedExt) throw Error('failed to decode extrinsic from chain!')
            // dont waste time proceeding if it's not ours.
            if (extrinsicToDecoded(curMultisig, decodedExt, curChainTokens, null) === 'not_ours') return null

            const hash = decodedExt.registry.hash(decodedExt.method.toU8a()).toHex()
            const timepoint_height = parseInt(timepoint.height.replace(/,/g, ''))
            const timepoint_index = parseInt(timepoint.index)
            const transactionID = makeTransactionID(curMultisig.chain, timepoint_height, timepoint_index)

            // try to get metadata
            let metadata = metadataCache[transactionID]
            if (!metadata) {
              try {
                const metadataValues = await getTxMetadataByPk(transactionID, {
                  proxy_address: curMultisig.proxyAddress,
                  chain: curMultisig.chain,
                  timepoint_height,
                  timepoint_index,
                })

                if (metadataValues) {
                  const extrinsicDerivedFromMetadataService = decodeCallData(api, metadataValues.callData)
                  if (!extrinsicDerivedFromMetadataService) {
                    throw new Error(
                      `Failed to create extrinsic from callData recieved from metadata sharing service for transactionID ${transactionID}`
                    )
                  }
                  const derivedHash = extrinsicDerivedFromMetadataService.registry
                    .hash(extrinsicDerivedFromMetadataService.method.toU8a())
                    .toHex()
                  if (derivedHash !== hash) {
                    throw new Error(
                      `CallData from metadata sharing service for transactionID ${transactionID} does not match hash from chain. Expected ${hash}, got ${derivedHash}`
                    )
                  }
                  console.log(`Loaded metadata for transactionID ${transactionID} from sharing service`)
                  metadata = [metadataValues, new Date()]
                  setMetadataCache({
                    ...metadataCache,
                    [transactionID]: metadata,
                  })
                }
              } catch (error) {
                console.error(`Failed to fetch callData for transactionID ${transactionID}:`, error)
              }
            }

            // decorate it if we have additional metadata
            let description = null
            let changeConfigDetails = null
            if (metadata) {
              description = metadata[0].description
              changeConfigDetails = metadata[0].changeConfigDetails || null
            }
            const decodedTx = extrinsicToDecoded(curMultisig, decodedExt, curChainTokens, changeConfigDetails)
            if (decodedTx === 'not_ours') return null

            const signer = Address.fromSs58(ext.signer.toString())
            if (!signer) throw Error('chain returned invalid ss58 address!')
            const executedAt: ExecutedAt = {
              block: block.block.header.number.toNumber(),
              index: r.indexInBlock,
              by: signer,
            }
            const transaction: Transaction = {
              hash,
              approvals: {},
              executedAt: executedAt,
              multisig: curMultisig,
              date: new Date(timestamp),
              callData,
              description: description || decodedExt.method.meta.name.toString(),
              decoded: decodedTx,
              id: transactionID,
            }
            return transaction
          } else {
            console.error('error decoding extrinsic!')
            return null
          }
        })
      })
      .flat()

    const transactions = (await Promise.all(promises)).filter(r => r !== null) as Transaction[]

    setLoading(false)
    setTransactions(transactions)
  }, [
    ready,
    allApisLoadable,
    metadataCache,
    rawConfirmedTransactionsResponses.contents,
    setMetadataCache,
    allActiveChainTokens.contents,
  ])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  return { loading, transactions }
}
