import type { ApiPromise } from '@polkadot/api'
import type { AccountId32 } from '@polkadot/types/interfaces'
import { BN_ZERO } from '@polkadot/util'

const rootMinStake = BN_ZERO

const isRootVerifiedAndStaked = async (api: ApiPromise, era: number, root: AccountId32) => {
  const [identity, exposure] = await Promise.all([
    api.query.identity.identityOf(root),
    api.query.staking.erasStakers(era, root),
  ])

  return identity.isSome && exposure.own.unwrap().gte(rootMinStake)
}

const isPoolRecommended = async (api: ApiPromise, era: number, poolId: number) => {
  const bondedPool = await api.query.nominationPools.bondedPools(poolId)
  if (bondedPool.isNone) return false

  const { state, roles } = bondedPool.unwrap()
  if (!state.isOpen || roles.root.isNone) return false

  return await isRootVerifiedAndStaked(api, era, roles.root.unwrap())
}

export const getRecommendedPoolIds = async (api: ApiPromise) => {
  const [rewardPoolCount, activeEra] = await Promise.all([
    api.query.nominationPools.counterForRewardPools(),
    api.query.staking.activeEra(),
  ])
  const era = activeEra.unwrapOrDefault().index.toNumber()

  const poolIds = Array.from({ length: rewardPoolCount.toNumber() }, (_, index) => index + 1)
  const isRecommended = await Promise.all(
    poolIds.map(async poolId => await isPoolRecommended(api, era, poolId).catch(() => false))
  )

  return poolIds.filter((_, index) => isRecommended[index])
}
