import { useCallback, useEffect, useMemo, useState } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { aggregatedMultisigsState, pendingTransactionsState } from '../multisig'
import { activeTeamsState } from './teams'
import { gql } from 'graphql-request'
import { requestSignetBackend } from './hasura'
import { SignedInAccount, selectedAccountState } from '../auth'
import { makeTransactionID } from '../../util/misc'
import { supportedChains } from '../chains'
import { isEqual } from 'lodash'

// TODO: should handle pagination
const TX_METADATA_QUERY = gql`
  query TxMetadata($teamIds: [uuid!]!) {
    tx_metadata(where: { team_id: { _in: $teamIds } }, order_by: { created: desc }, limit: 300) {
      team_id
      timepoint_height
      timepoint_index
      chain
      call_data
      change_config_details
      created
      description
    }
  }
`

export type RawTxMetadata = {
  team_id: string
  timepoint_height: number
  timepoint_index: number
  chain: string
  call_data: string
  change_config_details: any
  created: string
  description: string
}

export type TxMetadata = {
  extrinsicId: string
  teamId: string
  timepointHeight: number
  timepointIndex: number
  chain: string
  callData: string
  changeConfigDetails: any
  created: Date
  description: string
}

// TODO: add more properties to support pagination
type TxMetadataByTeamId = Record<string, { data: Record<string, TxMetadata> }>

// txMetadataByTeamId.teamId.data.txId = TxMetadata
export const txMetadataByTeamIdState = atom<TxMetadataByTeamId>({
  key: 'txMetadataByTeamId',
  default: {},
  dangerouslyAllowMutability: true,
})

export const txMetadataLoadingState = atom({
  key: 'txMetadataLoading',
  default: false,
})

const parseTxMetadata = (rawTxMetadata: RawTxMetadata): TxMetadata => {
  const chain = supportedChains.find(c => c.squidIds.chainData === rawTxMetadata.chain)
  if (!chain) throw Error(`Chain ${rawTxMetadata.chain} not found`)

  return {
    extrinsicId: makeTransactionID(chain, rawTxMetadata.timepoint_height, rawTxMetadata.timepoint_index),
    teamId: rawTxMetadata.team_id,
    timepointHeight: rawTxMetadata.timepoint_height,
    timepointIndex: rawTxMetadata.timepoint_index,
    chain: rawTxMetadata.chain,
    callData: rawTxMetadata.call_data,
    changeConfigDetails: rawTxMetadata.change_config_details,
    created: new Date(rawTxMetadata.created),
    description: rawTxMetadata.description,
  }
}

const getTransactionsMetadata = async (teamIds: string[], signedInAccount: SignedInAccount): Promise<TxMetadata[]> => {
  try {
    const { data } = await requestSignetBackend<{ tx_metadata: RawTxMetadata[] }>(
      TX_METADATA_QUERY,
      { teamIds },
      signedInAccount
    )
    const txMetadataList: TxMetadata[] = []
    if (data && data.tx_metadata) {
      data.tx_metadata.forEach(rawMetadata => {
        try {
          txMetadataList.push(parseTxMetadata(rawMetadata))
        } catch (e) {
          console.error(`Found invalid tx_metadata: ${rawMetadata}`)
          console.error(e)
        }
      })
    }

    return txMetadataList
  } catch (e) {
    console.error(e)
    return []
  }
}
// need to make sure this syncs every X seconds
export const TxMetadataWatcher = () => {
  const signedInAccount = useRecoilValue(selectedAccountState)
  const multisigs = useRecoilValue(aggregatedMultisigsState)
  const teams = useRecoilValue(activeTeamsState)
  const [txMetadataByTeamId, setTxMetadataByTeamId] = useRecoilState(txMetadataByTeamIdState)
  const [initiated, setInitiated] = useState(false)
  const [nextFetch, setNextFetch] = useState<Date>(new Date())
  const pendingTransactions = useRecoilValue(pendingTransactionsState)
  const [loading, setLoading] = useState(false)

  const shouldFetchData = useMemo(() => {
    //if the latest pending tx doesnt have metadata, we have a new tx that we need to get metadata for
    if (pendingTransactions.length > 0 && !pendingTransactions[0]?.callData) return true
    return false
  }, [pendingTransactions])

  const fetchMetadata = useCallback(async () => {
    if (!teams || !signedInAccount) return

    if (!initiated || shouldFetchData) {
      setLoading(true)
      try {
        const teamIds = teams.map(t => t.id)
        // only fetch metadata for active multisigs that are stored in db
        const idsToQuery = multisigs.map(m => m.id).filter(id => teamIds.includes(id))
        const txMetadataList = await getTransactionsMetadata(idsToQuery, signedInAccount)

        const newTxMetadataByTeamId: TxMetadataByTeamId = {}
        Object.entries(txMetadataByTeamId).forEach(([teamId, txMetadata]) => {
          newTxMetadataByTeamId[teamId] = txMetadata
        })

        txMetadataList.forEach(txMetadata => {
          if (!newTxMetadataByTeamId[txMetadata.teamId]) newTxMetadataByTeamId[txMetadata.teamId] = { data: {} }

          newTxMetadataByTeamId[txMetadata.teamId]!.data[txMetadata.extrinsicId] = txMetadata
        })

        if (isEqual(newTxMetadataByTeamId, txMetadataByTeamId)) return
        setTxMetadataByTeamId(newTxMetadataByTeamId)
      } catch (e) {
      } finally {
        setLoading(false)
        setInitiated(true)
      }
    }
  }, [initiated, multisigs, setTxMetadataByTeamId, shouldFetchData, signedInAccount, teams, txMetadataByTeamId])

  const multisigsId = useMemo(() => multisigs?.map(t => t.id).join(' ') ?? '', [multisigs])

  useEffect(() => {
    setInitiated(false)
    setNextFetch(new Date())
    const interval = setInterval(() => {
      setNextFetch(new Date())
    }, 5_000)
    return () => clearInterval(interval)
    // trigger refetch if the multisigs being watched is changed
  }, [multisigsId])

  useEffect(() => {
    if (new Date().getTime() < nextFetch.getTime() || loading) return
    fetchMetadata()
  }, [fetchMetadata, loading, nextFetch])

  return null
}
