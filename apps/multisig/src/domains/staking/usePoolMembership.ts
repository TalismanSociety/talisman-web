import { Balance } from '@polkadot/types/interfaces/runtime'
import { Address } from '@util/addresses'
import { Chain } from '../chains'
import { useApi } from '../chains/pjs-api'
import { useCallback, useEffect, useState } from 'react'

type PoolMembership = {
  id: number
  balance: Balance
}

export const usePoolMembership = (address: Address, chain: Chain) => {
  const { api } = useApi(chain.rpcs)
  const [membership, setMembership] = useState<PoolMembership | undefined | null>()

  const subscribePoolMembership = useCallback(async () => {
    if (!api || !api.query) return

    // nom pool pallet not supported
    if (!api.query.nominationPools) {
      setMembership(null)
      return
    }

    api.query.nominationPools.poolMembers(address.toSs58(chain), async membershipRaw => {
      const balance = await api.call.nominationPoolsApi.pointsToBalance(
        membershipRaw.value.poolId,
        membershipRaw.value.points
      )
      if (!membershipRaw.isEmpty) {
        setMembership({
          id: +membershipRaw.value.poolId.toString(),
          balance,
        })
      } else {
        // no membership in any pool
        setMembership(null)
      }
    })
  }, [address, api, chain])

  useEffect(() => {
    if (membership) return

    subscribePoolMembership()
  }, [membership, subscribePoolMembership])

  // cleanup if address / chain changed
  useEffect(() => {
    setMembership(undefined)
  }, [address, chain])

  return { loading: membership === undefined, membership }
}
