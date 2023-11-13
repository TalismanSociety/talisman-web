import { useCallback, useEffect, useMemo, useState } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { ChangeConfigDetails, aggregatedMultisigsState, pendingTransactionsState } from '../multisig'
import { activeTeamsState, teamsBySignerState } from './teams'
import { gql } from 'graphql-request'
import { requestSignetBackend } from './hasura'
import { SignedInAccount, selectedAccountState } from '../auth'
import { makeTransactionID } from '../../util/misc'
import { supportedChains } from '../chains'
import { isEqual } from 'lodash'
import { insertTxMetadata } from '../metadata-service'
import { Multisig } from '../multisig/index'
import toast from 'react-hot-toast'
import { Address } from '../../util/addresses'

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

  let changeConfigDetails: ChangeConfigDetails | undefined = undefined
  if (rawTxMetadata.change_config_details) {
    let newMembers: Address[] | undefined = undefined
    let newThreshold: number | undefined
    if (rawTxMetadata.change_config_details.newMembers) {
      newMembers = rawTxMetadata.change_config_details.newMembers.map((s: string) => Address.fromSs58(s))
    }
    if (rawTxMetadata.change_config_details.newThreshold) {
      newThreshold = rawTxMetadata.change_config_details.newThreshold
    }
    if (typeof newThreshold !== 'number' || !newMembers || newThreshold > newMembers.length) {
      console.error(`Invalid change config details: ${rawTxMetadata.change_config_details}`)
    } else {
      changeConfigDetails = { newMembers, newThreshold }
    }
  }

  return {
    extrinsicId: makeTransactionID(chain, rawTxMetadata.timepoint_height, rawTxMetadata.timepoint_index),
    teamId: rawTxMetadata.team_id,
    timepointHeight: rawTxMetadata.timepoint_height,
    timepointIndex: rawTxMetadata.timepoint_index,
    chain: rawTxMetadata.chain,
    callData: rawTxMetadata.call_data,
    changeConfigDetails,
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
  const [lastFetched, setLastFetched] = useState<Date>(new Date())
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
        setLastFetched(new Date())
      }
    }
  }, [initiated, multisigs, setTxMetadataByTeamId, shouldFetchData, signedInAccount, teams, txMetadataByTeamId])

  const multisigsId = useMemo(() => multisigs?.map(t => t.id).join(' ') ?? '', [multisigs])

  // instantly trigger call if multisigs are changed
  useEffect(() => {
    setInitiated(false)
    setLoading(false)
  }, [multisigsId])

  // first initial call before interval gets triggered
  useEffect(() => {
    if (initiated || loading) return
    fetchMetadata()
  }, [fetchMetadata, initiated, loading])

  // refresh data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date().getTime() < lastFetched.getTime() + 5_000 || loading) return
      fetchMetadata()
    }, 5_000)
    return () => clearInterval(interval)
    // trigger refetch if the multisigs being watched is changed
  }, [fetchMetadata, lastFetched, loading, multisigsId])

  return null
}

// handles inserting tx metadata to db, as well as fast insert into cache
export const useInsertTxMetadata = () => {
  const [txMetadataByTeamId, setTxMetadataByTeamId] = useRecoilState(txMetadataByTeamIdState)
  const teamsBySigner = useRecoilValue(teamsBySignerState)

  const insertMetadata = useCallback(
    async (
      signedInAccount: SignedInAccount,
      multisig: Multisig,
      other: Pick<
        TxMetadata,
        'callData' | 'changeConfigDetails' | 'description' | 'timepointHeight' | 'timepointIndex'
      > & { hash: string; extrinsicId: string }
    ) => {
      const activeTeams = teamsBySigner[signedInAccount.injected.address.toSs58()]

      // make sure multisig is stored in db
      if (!activeTeams || !activeTeams.find(team => team.id === multisig.id)) return

      const newTxMetadataByTeamId: TxMetadataByTeamId = {}
      Object.entries(txMetadataByTeamId).forEach(([teamId, txMetadata]) => {
        newTxMetadataByTeamId[teamId] = txMetadata
      })

      const txMetadata: TxMetadata = {
        extrinsicId: other.extrinsicId,
        teamId: multisig.id,
        timepointHeight: other.timepointHeight,
        timepointIndex: other.timepointIndex,
        chain: multisig.chain.squidIds.chainData,
        callData: other.callData,
        changeConfigDetails: other.changeConfigDetails,
        created: new Date(),
        description: other.description,
      }

      if (!newTxMetadataByTeamId[multisig.id]) newTxMetadataByTeamId[multisig.id] = { data: {} }

      newTxMetadataByTeamId[multisig.id]!.data[other.extrinsicId] = txMetadata

      setTxMetadataByTeamId(newTxMetadataByTeamId)

      // store metadata to db
      insertTxMetadata({
        multisig_address: multisig.multisigAddress,
        proxy_address: multisig.proxyAddress,
        chain: multisig.chain,
        call_data: other.callData,
        call_hash: other.hash,
        description: other.description,
        timepoint_height: other.timepointHeight,
        timepoint_index: other.timepointIndex,
        change_config_details: other.changeConfigDetails,
        team_id: multisig.id,
      })
        .then(() => {
          console.log(`Successfully POSTed metadata for ${other.extrinsicId} to metadata service`)
        })
        .catch(e => {
          console.error('Failed to POST tx metadata sharing service: ', e)
          toast.error('Failed to POST tx metadata sharing service. See console for more info.')
        })
    },
    [setTxMetadataByTeamId, teamsBySigner, txMetadataByTeamId]
  )

  return insertMetadata
}

interface TxMetadataByPkResponseRaw {
  tx_metadata: {
    change_config_details: {
      newThreshold: number
      newMembers: string[]
    }
  }[]
}

export async function getAllChangeAttempts(
  multisig: Multisig,
  acc?: SignedInAccount | null
): Promise<ChangeConfigDetails[]> {
  if (!acc) return []

  const variables = {
    teamId: multisig.id,
    multisigAddress: multisig.multisigAddress.toSs58(multisig.chain),
    chain: multisig.chain.squidIds.chainData,
  }

  const query = gql`
    query AllChangeConfigAttempts($teamId: uuid!, $multisigAddress: String!, $chain: String!) {
      tx_metadata(
        where: {
          team_id: { _eq: $teamId }
          multisig_address: { _eq: $multisigAddress }
          chain: { _eq: $chain }
          change_config_details: { _is_null: false }
        }
      ) {
        change_config_details
      }
    }
  `

  const res = await requestSignetBackend<TxMetadataByPkResponseRaw>(query, variables, acc)

  return (
    res.data?.tx_metadata.map(tx => {
      return {
        newThreshold: tx.change_config_details.newThreshold,
        newMembers: tx.change_config_details.newMembers.map(m => {
          const address = Address.fromSs58(m)
          if (!address) throw new Error(`Invalid address returned from tx_metadata!`)
          return address
        }),
      }
    }) ?? []
  )
}
