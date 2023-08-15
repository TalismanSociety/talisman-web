import { decodeCallData, tokenByIdQuery } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { getTxMetadataByPk } from '@domains/metadata-service'
import { Transaction, extrinsicToDecoded, selectedMultisigState } from '@domains/multisig'
import { gql } from 'graphql-request'
import { atom, selector } from 'recoil'

import fetchGraphQL from '../../graphql/fetch-graphql'

// Change this value to the current date to trigger a reload of pending txs
export const confirmedTransactionsDependency = atom<Date>({
  key: 'ConfirmedTransactionsDependency',
  default: new Date(),
})

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

// fetches the raw txs from the chain
export const confirmedTransactionsSelector = selector({
  key: 'confirmedTransactionsSelector',
  get: async ({ get }): Promise<Transaction[]> => {
    // This dependency allows effectively clearing the cache of this selector
    get(confirmedTransactionsDependency)

    const selectedMultisig = get(selectedMultisigState)
    const nativeToken = get(tokenByIdQuery(selectedMultisig.chain.nativeToken.id))
    const api = get(pjsApiSelector(selectedMultisig.chain.rpc))
    await api.isReady

    const query = gql`
      query ConfirmedTransactions($signer_in: [String!], $chain_name: String!) {
        extrinsics(
          where: {
            call: {
              data_jsonContains: "{\\"name\\":\\"Multisig.as_multi\\"}"
              block: { chainId_eq: $chain_name }
              calls_some: {
                data_jsonContains: "{\\"name\\":\\"Proxy.proxy\\"}"
                calls_every: { extrinsics_every: { success_eq: true } }
              }
            }
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
    const promises = rawResponse.data.extrinsics.map(async r => {
      const block = await api.rpc.chain.getBlock(r.block.blockHash)
      const timestamp = r.block.timestamp
      // fetch the outer ext
      const ext = block.block.extrinsics[r.indexInBlock]
      if (!ext) throw Error("couldn't find extrinsic in block")
      // inner ext is 3rd arg
      const innerExt = ext.method.args[3]
      let callData = innerExt?.toHex()
      if (callData) {
        // pull the timepoint and timepoint index out of the original ext
        const timepoint = ext.method.args[2]?.toHuman() as { height: string; index: string }
        const metadataValues = await getTxMetadataByPk({
          multisig: selectedMultisig.multisigAddress,
          chain: selectedMultisig.chain,
          timepoint_height: parseInt(timepoint.height.replace(/,/g, '')),
          timepoint_index: parseInt(timepoint.index),
        })

        // decorate it if we have additional metadata
        let description = null
        let changeConfigDetails = null
        if (metadataValues) {
          description = metadataValues.description
          changeConfigDetails = metadataValues.changeConfigDetails || null
        }

        const decodedExt = decodeCallData(api, callData)
        const decoded = extrinsicToDecoded(selectedMultisig, decodedExt, nativeToken, changeConfigDetails)
        if (decoded === 'not_ours') return null

        const hash = decodedExt.registry.hash(decodedExt.method.toU8a()).toHex()
        const signer = ext.signer.toHex()
        const approvals = { [signer]: true }
        const transaction: Transaction = {
          hash,
          approvals,
          chain: selectedMultisig.chain,
          date: new Date(timestamp),
          callData,
          description: description || decodedExt.method.meta.name.toString(),
          decoded,
        }
        return transaction
      } else {
        console.error('error decoding extrinsic!')
        return null
      }
    })

    return (await Promise.all(promises)).filter(r => r !== null) as Transaction[]
  },
  dangerouslyAllowMutability: true, // pjs wsprovider mutates itself to track connection msg stats
})
