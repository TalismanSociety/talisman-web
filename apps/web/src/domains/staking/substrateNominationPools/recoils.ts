import { substrateAccountsState } from '@domains/accounts/recoils'
import { chainsState, type Chain } from '@domains/chains'
import { useSubstrateApiEndpoint } from '@domains/common'
import { chainReadIdState, substrateApiState } from '@domains/common/recoils'
import type { AnyNumber } from '@polkadot/types-codec/types'
import { encodeAddress } from '@polkadot/util-crypto'
import DotPoolSelector, { ValidatorSelector, defaultOptions } from '@talismn/dot-pool-selector'
import { Decimal } from '@talismn/math'
import BN from 'bn.js'
import { fromUnixTime, isAfter, isBefore, max as maxDate, startOfDay } from 'date-fns'
import { selectorFamily, waitForAll, type SerializableParam } from 'recoil'

export const allPendingPoolRewardsState = selectorFamily({
  key: 'AllPendingRewards',
  get:
    (endpoint: string) =>
    async ({ get }) => {
      get(chainReadIdState)

      const api = get(substrateApiState(endpoint))
      const accounts = get(substrateAccountsState)

      return await Promise.all(
        accounts.map(
          async ({ address }) =>
            await api.call.nominationPoolsApi.pendingRewards(address).then(result => [address, result] as const)
        )
      )
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
  // NOTE: polkadot.js returned codec object includes reference to the registry
  // which shouldn't be freezed
  dangerouslyAllowMutability: true,
})

export const useAllPendingRewardsState = () => allPendingPoolRewardsState(useSubstrateApiEndpoint())

// TODO: refactor to selector that can read all storage entries
export const eraStakersState = selectorFamily({
  key: 'EraStakers',
  get:
    ({ endpoint, era }: { endpoint: string; era: Extract<AnyNumber, SerializableParam> }) =>
    async ({ get }) => {
      const api = get(substrateApiState(endpoint))

      return await api.query.staking.erasStakers.entries(era)
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
  // NOTE: polkadot.js returned codec object includes reference to the registry
  // which shouldn't be freezed
  dangerouslyAllowMutability: true,
})

export const useEraStakersState = (era: Extract<AnyNumber, SerializableParam>) =>
  eraStakersState({ endpoint: useSubstrateApiEndpoint(), era })

export const recommendedPoolsState = selectorFamily({
  key: 'Staking/BondedPools',
  get:
    (endpoint: string) =>
    async ({ get }) => {
      const chains = get(chainsState)
      const api = get(substrateApiState(endpoint))

      const chain = chains.find(x => x.genesisHash === api.genesisHash.toHex())

      const recommendedPoolIds = await new DotPoolSelector(new ValidatorSelector(api), api, {
        ...defaultOptions,
        numberOfPools: Infinity,
      })
        .getPoolsMeetingCriteria()
        .then(x => x.map(({ poolId }) => poolId))

      const pools = await api.query.nominationPools.bondedPools
        .entries()
        .then(x => x.map(y => ({ poolId: y[0].args[0].toNumber() ?? 0, bondedPool: y[1] })))

      const names = await api.query.nominationPools.metadata.multi(pools.map(({ poolId }) => poolId))

      return pools
        .map((pool, index) => ({ ...pool, name: names[index]?.toUtf8() }))
        .filter(pool => pool.bondedPool.isSome)
        .map(pool => ({ ...pool, bondedPool: pool.bondedPool.unwrap() }))
        .sort((a, b) =>
          a.poolId === chain?.priorityPool && b.poolId !== chain.priorityPool
            ? -1
            : b.poolId === chain?.priorityPool && a.poolId !== chain.priorityPool
            ? 1
            : recommendedPoolIds.includes(a.poolId) && !recommendedPoolIds.includes(b.poolId)
            ? -1
            : recommendedPoolIds.includes(b.poolId) && !recommendedPoolIds.includes(a.poolId)
            ? 1
            : b.bondedPool.points.cmp(a.bondedPool.points)
        )
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
  // NOTE: polkadot.js returned codec object includes reference to the registry
  // which shouldn't be freezed
  dangerouslyAllowMutability: true,
})

export const useRecommendedPoolsState = () => recommendedPoolsState(useSubstrateApiEndpoint())

type SubscanPayout = {
  pool_id: number
  module_id: string
  event_id: string
  extrinsic_index: string
  event_index: string
  block_timestamp: number
  amount: string
  account_display: {
    address: string
  }
}

type SubscanNominationPoolRewardsResponse = {
  code: number
  message: string
  generated_at: number
  data: {
    count: number
    list: readonly SubscanPayout[]
  }
}

const subscanPoolPayoutsState = selectorFamily<
  readonly SubscanPayout[],
  { account: string; poolId: number; chain: Chain; fromDate?: Date; toDate?: Date }
>({
  key: 'SubscanPayouts',
  get:
    ({ account, poolId, chain, fromDate, toDate }) =>
    async ({ get }) => {
      const api = get(substrateApiState(chain.rpc))

      const createPayoutsGenerator = async function* () {
        const limit = 100
        let page = 0

        while (true) {
          const response: SubscanNominationPoolRewardsResponse = await fetch(
            new URL('api/scan/nomination_pool/rewards', chain.subscanUrl.replace('subscan', 'api.subscan')),
            {
              method: 'POST',
              headers: { 'X-API-Key': '6543451cf4d8429f9767c6b5026b349d' },
              body: JSON.stringify({
                address: encodeAddress(account, api.registry.chainSS58),
                pool_id: poolId,
                row: limit,
                page,
              }),
            }
          ).then(async x => await x.json())

          yield* response.data.list

          if (response.data.list.length === 0 || response.data.list.length < limit) {
            break
          }

          // Just get the latest entries if date range is undefined
          if (fromDate === undefined) {
            break
          }

          // Got all the data down to the oldest date that we need
          if (
            isBefore(
              startOfDay(maxDate(response.data.list.map(x => fromUnixTime(x.block_timestamp)))),
              startOfDay(fromDate)
            )
          ) {
            break
          }

          page += 1
        }
      }

      const payouts = []

      for await (const payout of createPayoutsGenerator()) {
        const date = startOfDay(fromUnixTime(payout.block_timestamp))

        if (fromDate !== undefined && toDate !== undefined) {
          if (isBefore(date, startOfDay(fromDate)) || isAfter(date, startOfDay(toDate))) {
            continue
          }
        }

        payouts.push(payout)
      }

      return payouts
    },
})

const _poolPayoutsState = selectorFamily({
  key: 'Payouts',
  get:
    (params: { account: string; poolId: number; chain: Chain; fromDate?: Date; toDate?: Date }) =>
    ({ get }) => {
      const [api, response] = get(waitForAll([substrateApiState(params.chain.rpc), subscanPoolPayoutsState(params)]))

      return response.map(x => ({
        date: fromUnixTime(x.block_timestamp),
        amount: Decimal.fromPlanck(x.amount, api.registry.chainDecimals.at(0) ?? 0, api.registry.chainTokens.at(0)),
      }))
    },
})

/**
 * Set date to start of date to prevent multiple selectors of different time in day
 */
export const poolPayoutsState = (params: {
  account: string
  poolId: number
  chain: Chain
  fromDate: Date
  toDate: Date
}) => _poolPayoutsState({ ...params, fromDate: startOfDay(params.fromDate), toDate: startOfDay(params.toDate) })

export const totalPoolPayoutsState = selectorFamily({
  key: 'TotalPayouts',
  get:
    (params: { account: string; poolId: number; chain: Chain; fromDate: Date; toDate: Date }) =>
    ({ get }) => {
      const [api, payouts] = get(waitForAll([substrateApiState(params.chain.rpc), poolPayoutsState(params)]))

      return Decimal.fromPlanck(
        payouts.reduce((prev, curr) => prev.add(curr.amount.planck), new BN(0)),
        api.registry.chainDecimals.at(0) ?? 0,
        api.registry.chainTokens.at(0)
      )
    },
})

/**
 * Omit date range to get the most recent payouts
 */
export const mostRecentPoolPayoutsState = ({
  account,
  poolId,
  chain,
}: {
  account: string
  poolId: number
  chain: Chain
}) => _poolPayoutsState({ account, poolId, chain })
