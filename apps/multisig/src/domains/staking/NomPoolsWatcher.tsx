import { useCallback, useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useSelectedMultisig } from '../multisig'
import { useApi } from '../chains/pjs-api'
import { Address } from '../../util/addresses'
import { usePoolConfig } from './usePoolConfig'
import { ApiPromise } from '@polkadot/api'
import type { StorageKey, u32 } from '@polkadot/types'

type BondedPoolRaw = {
  memberCounter: string
  points: string
  roles: {
    depositor: string
    root: string
    nominator: string
    bouncer: string
  }
  state: 'Open' | 'Destroying' | 'Blocked'
}

export type BondedPool = {
  id: number
  memberCounter: number
  points: bigint
  roles: {
    depositor: Address
    root: Address
    nominator: Address
    bouncer: Address
  }
  stash: Address
  reward: Address
  state: 'Open' | 'Destroying' | 'Blocked'
  metadata?: string
}

export const bondedPoolsState = atom<
  | {
      pools: BondedPool[]
      poolsMap: Record<number, BondedPool>
      chain: string
    }
  | undefined
>({
  key: 'bondedPoolsStateKey',
  default: undefined,
})

const getPoolId = (raw: StorageKey<[u32]>): number => {
  const idRaw = raw.toHuman()
  if (Array.isArray(idRaw) && idRaw[0]) {
    return +idRaw[0]
  }
  return 0
}

export const NomPoolsWatcher: React.FC = () => {
  const [multisig] = useSelectedMultisig()
  const { api } = useApi(multisig.chain.rpcs)
  const [bondedPools, setBondedPools] = useRecoilState(bondedPoolsState)
  const { createAccounts } = usePoolConfig()

  const fetchMetadataMulti = useCallback(async (api: ApiPromise, ids: number[]): Promise<Record<number, string>> => {
    const metadata = await api.query.nominationPools.metadata.multi(ids)
    return Object.fromEntries(metadata.map((m, i) => [ids[i], String(m.toHuman())]))
  }, [])

  const fetchNomPools = useCallback(async () => {
    if (!api || !api.query) return

    if (!api.query.nominationPools) {
      setBondedPools({
        pools: [],
        poolsMap: {},
        chain: multisig.chain.chainName,
      })
      return
    }
    const pools = await api.query.nominationPools.bondedPools.entries()
    const metadataMulti = await fetchMetadataMulti(
      api,
      pools.map(([key]) => getPoolId(key))
    )

    const poolsMap: Record<number, BondedPool> = {}
    const bondedPools = pools.map(([key, value]): BondedPool | null => {
      const id = getPoolId(key)

      const bondedPoolRaw = value.toHuman() as BondedPoolRaw
      const depositor = Address.fromSs58(bondedPoolRaw.roles.depositor)
      const root = Address.fromSs58(bondedPoolRaw.roles.root)
      const nominator = Address.fromSs58(bondedPoolRaw.roles.nominator)
      const bouncer = Address.fromSs58(bondedPoolRaw.roles.bouncer)

      if (id === undefined || !depositor || !root || !nominator || !bouncer) return null

      const { stash: stashString, reward: rewardString } = createAccounts(id)
      const stash = Address.fromSs58(stashString)
      const reward = Address.fromSs58(rewardString)
      if (!stash || !reward) return null

      const metadata = metadataMulti[id]

      const pool = {
        id,
        memberCounter: +bondedPoolRaw.memberCounter,
        points: BigInt(bondedPoolRaw.points.replaceAll(',', '')),
        roles: {
          depositor,
          root,
          nominator,
          bouncer,
        },
        stash,
        reward,
        state: bondedPoolRaw.state,
        metadata: metadata === '' ? undefined : metadata,
      }
      poolsMap[id] = pool
      return pool
    })

    setBondedPools({
      pools: bondedPools.filter(p => p !== null) as BondedPool[],
      poolsMap,
      chain: multisig.chain.chainName,
    })
  }, [api, createAccounts, fetchMetadataMulti, multisig.chain.chainName, setBondedPools])

  useEffect(() => {
    // up to date
    if (bondedPools && bondedPools.chain === multisig.chain.chainName) return
    fetchNomPools()
  }, [bondedPools, fetchNomPools, multisig.chain.chainName])

  // clean up when switching chains
  useEffect(() => {
    if (!bondedPools || bondedPools.chain === multisig.chain.chainName) return
    setBondedPools(undefined)
  }, [bondedPools, multisig.chain.chainName, setBondedPools])

  return null
}
