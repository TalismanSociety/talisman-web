import { Chain } from '@domains/chains'
import { ChangeConfigDetails, TxOffchainMetadata } from '@domains/multisig'
import { Address } from '@util/addresses'
import { gql, request } from 'graphql-request'

import { METADATA_SERVICE_URL } from '.'

interface TxMetadataByPkArgs {
  timepoint_height: number
  timepoint_index: number
  multisig: Address
  chain: Chain
}

interface TxMetadataByPkVariables {
  timepoint_height: number
  timepoint_index: number
  multisig: string
  chain: string
}

interface TxMetadataByPkResponseRaw {
  tx_metadata_by_pk: {
    call_data: string
    description: string
    change_config_details?: {
      newThreshold: number
      newMembers: string[]
    }
  } | null
}

// store nulls in a transient cache to avoid hitting the metadata service multiple times in the
// same session for the same key it doesn't have
const cache = new Map<string, Promise<TxOffchainMetadata | null>>()

export async function getTxMetadataByPk(
  callHash: string,
  args: TxMetadataByPkArgs
): Promise<TxOffchainMetadata | null> {
  const variables: TxMetadataByPkVariables = {
    timepoint_height: args.timepoint_height,
    timepoint_index: args.timepoint_index,
    multisig: args.multisig.toSs58(args.chain),
    chain: args.chain.squidIds.chainData,
  }
  if (cache.has(callHash)) return cache.get(callHash)!

  cache.set(
    callHash,
    new Promise(async (resolve, reject) => {
      try {
        const query = gql`
          query TxMetadataByPk($timepoint_height: Int!, $timepoint_index: Int!, $multisig: String!, $chain: String!) {
            tx_metadata_by_pk(
              multisig: $multisig
              timepoint_height: $timepoint_height
              timepoint_index: $timepoint_index
              chain: $chain
            ) {
              call_data
              description
              change_config_details
            }
          }
        `

        const res = (await request(
          METADATA_SERVICE_URL,
          query,
          variables as Record<string, any>
        )) as TxMetadataByPkResponseRaw
        if (res.tx_metadata_by_pk === null) {
          console.warn(`Metadata service has no value for ${callHash}`)
          resolve(null)
          return
        }

        const changeConfigDetails: ChangeConfigDetails | undefined = res.tx_metadata_by_pk.change_config_details
          ? {
              newThreshold: res.tx_metadata_by_pk.change_config_details.newThreshold,
              newMembers: res.tx_metadata_by_pk.change_config_details.newMembers.map(m => {
                const address = Address.fromSs58(m)
                if (!address) throw new Error(`Invalid address returned from tx_metadata!`)
                return address
              }),
            }
          : undefined

        resolve({
          callData: res.tx_metadata_by_pk.call_data as `0x${string}`,
          description: res.tx_metadata_by_pk.description,
          changeConfigDetails,
        })
      } catch (error) {
        console.error(error)
        reject("Couldn't fetch metadata")
      }
    })
  )
  return cache.get(callHash)!
}
