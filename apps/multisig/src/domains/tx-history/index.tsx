import { tokenByIdQuery, useDecodeCallData } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { getTxMetadataByPk } from '@domains/metadata-service'
import {
  ExecutedAt,
  Transaction,
  extrinsicToDecoded,
  selectedMultisigState,
  txOffchainMetadataState,
} from '@domains/multisig'
import { Address } from '@util/addresses'
import { gql } from 'graphql-request'
import { useCallback, useEffect, useState } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

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

export const rawConfirmedTransactionsSelector = selector({
  key: 'rawConfirmedTransactionsSelector',
  get: async ({ get }): Promise<RawResponse> => {
    const selectedMultisig = get(selectedMultisigState)
    const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
    await api.isReady

    // This dependency allows effectively clearing the cache of this selector
    get(rawConfirmedTransactionsDependency)

    const query = gql`
      query ConfirmedTransactions($signer_in: [String!], $chain_name: String!) {
        extrinsics(
          where: {
            call: { data_jsonContains: "{\\"name\\":\\"Multisig.as_multi\\"}", block: { chainId_eq: $chain_name } }
            success_eq: true
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
      signer_in: selectedMultisig.signers.map(s => s.toPubKey()),
      chain_name: selectedMultisig.chain.chainName.toLowerCase(),
    }

    const rawResponse: RawResponse = (await fetchGraphQL(query, variables, 'tx-history')) as RawResponse
    return rawResponse
  },
})

// fetches the raw txs from squid
export const useConfirmedTransactions = () => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(selectedMultisig.chain.rpc))
  const [metadataCache, setMetadataCache] = useRecoilState(txOffchainMetadataState)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const nativeToken = useRecoilValueLoadable(tokenByIdQuery(selectedMultisig.chain.nativeToken.id))
  const rawConfirmedTransactionsResponse = useRecoilValueLoadable(rawConfirmedTransactionsSelector)
  const { decodeCallData, loading: decodeCallDataLoading } = useDecodeCallData()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [selectedMultisig.multisigAddress])

  const ready =
    apiLoadable.state === 'hasValue' &&
    !decodeCallDataLoading &&
    nativeToken.state === 'hasValue' &&
    rawConfirmedTransactionsResponse.state === 'hasValue'

  const loadTransactions = useCallback(async () => {
    if (!ready) return
    const api = apiLoadable.contents

    const promises = rawConfirmedTransactionsResponse.contents.data.extrinsics.map(async r => {
      const block = await api.rpc.chain.getBlock(r.block.blockHash)
      const timestamp = r.block.timestamp
      // fetch the outer ext
      const ext = block.block.extrinsics[r.indexInBlock]
      if (!ext) throw Error("couldn't find extrinsic in block")
      // inner ext is 3rd arg
      const innerExt = ext.method.args[3]
      // @ts-ignore
      if (innerExt?.toHuman()?.method !== 'proxy' || innerExt?.toHuman()?.section !== 'proxy') return null
      let callData = innerExt?.toHex()
      if (callData) {
        // pull the timepoint and timepoint index out of the original ext
        const timepoint = ext.method.args[2]?.toHuman() as { height: string; index: string } | null
        // no timepoint means this was not an execution
        if (!timepoint) return null

        const decodedExt = decodeCallData(callData)
        if (!decodedExt) throw Error('failed to decode extrinsic from chain!')
        // dont waste time proceeding if it's not ours.
        if (extrinsicToDecoded(selectedMultisig, decodedExt, nativeToken.contents, null) === 'not_ours') return null

        const hash = decodedExt.registry.hash(decodedExt.method.toU8a()).toHex()

        // try to get metadata
        let metadata = metadataCache[hash]
        if (!metadata) {
          try {
            const metadataValues = await getTxMetadataByPk({
              multisig: selectedMultisig.multisigAddress,
              chain: selectedMultisig.chain,
              timepoint_height: parseInt(timepoint.height.replace(/,/g, '')),
              timepoint_index: parseInt(timepoint.index),
            })

            if (metadataValues) {
              const extrinsicDerivedFromMetadataService = decodeCallData(metadataValues.callData)
              if (!extrinsicDerivedFromMetadataService) {
                throw new Error(
                  `Failed to create extrinsic from callData recieved from metadata sharing service for hash ${hash}`
                )
              }
              const derivedHash = extrinsicDerivedFromMetadataService.registry
                .hash(extrinsicDerivedFromMetadataService.method.toU8a())
                .toHex()
              if (derivedHash !== hash) {
                throw new Error(
                  `CallData from metadata sharing service for hash ${hash} does not match hash from chain. Expected ${hash}, got ${derivedHash}`
                )
              }
              console.log(`Loaded metadata for callHash ${hash} from sharing service`)
              metadata = [metadataValues, new Date()]
              setMetadataCache({
                ...metadataCache,
                [hash]: metadata,
              })
            } else {
              console.warn(`Metadata service has no value for callHash ${hash}`)
            }
          } catch (error) {
            console.error(`Failed to fetch callData for callHash ${hash}:`, error)
          }
        }

        // decorate it if we have additional metadata
        let description = null
        let changeConfigDetails = null
        if (metadata) {
          description = metadata[0].description
          changeConfigDetails = metadata[0].changeConfigDetails || null
        }

        const decodedTx = extrinsicToDecoded(selectedMultisig, decodedExt, nativeToken.contents, changeConfigDetails)
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
          chain: selectedMultisig.chain,
          date: new Date(timestamp),
          callData,
          description: description || decodedExt.method.meta.name.toString(),
          decoded: decodedTx,
        }
        return transaction
      } else {
        console.error('error decoding extrinsic!')
        return null
      }
    })

    const transactions = (await Promise.all(promises)).filter(r => r !== null) as Transaction[]

    setLoading(false)
    setTransactions(transactions)
  }, [
    ready,
    apiLoadable.contents,
    decodeCallData,
    metadataCache,
    rawConfirmedTransactionsResponse.contents,
    nativeToken.contents,
    selectedMultisig,
    setMetadataCache,
  ])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  return { loading, transactions, ready }
}
