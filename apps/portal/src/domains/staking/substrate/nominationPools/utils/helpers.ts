import { ApiPromise } from '@polkadot/api'

/**
 * Calculates the duration of a staking era in milliseconds
 * @param api - ApiPromise instance with babe and staking constants
 * @returns Era duration in milliseconds
 */
export const getStakingEraDurationMs = (babeApi: ApiPromise): bigint => {
  const blockTime = babeApi.consts.babe?.expectedBlockTime?.toBigInt() ?? 0n
  const epochDuration = babeApi.consts.babe?.epochDuration?.toBigInt() ?? 0n
  const sessionsPerEra = babeApi.consts.staking?.sessionsPerEra?.toNumber() ?? 0

  return blockTime * BigInt(sessionsPerEra) * epochDuration
}

/**
 * Calculates the number of staking eras per year
 * @param babeApi - ApiPromise instance with babe and staking constants
 * @returns Number of eras per year
 */
export const getStakingErasPerYear = (babeApi: ApiPromise): bigint => {
  const MS_PER_YEAR = 1000n * 60n * 60n * 24n * 365n
  const eraDuration = getStakingEraDurationMs(babeApi)

  if (eraDuration === 0n) {
    return 0n
  }

  return MS_PER_YEAR / eraDuration
}

/**
 * Calculates the staking bonding duration in milliseconds
 * @param api - ApiPromise instance with babe and staking constants
 * @returns Bonding duration in milliseconds
 */
export const getStakingBondingDurationMs = ({
  stakingApi,
  babeApi,
}: {
  stakingApi: ApiPromise
  babeApi: ApiPromise | null
}): bigint => {
  if (!babeApi) {
    console.error('Babe API is null')
    return 0n
  }

  const bondingDuration = stakingApi.consts.staking.bondingDuration.toNumber()
  const eraDuration = getStakingEraDurationMs(babeApi)

  return BigInt(bondingDuration) * eraDuration
}

/**
 * Calculates the staking APR based on historical era rewards and stakes
 * @param eraRewards - Array of era validator rewards
 * @param eraTotalStakes - Array of total stakes per era
 * @param babeApi - ApiPromise instance with babe and staking constants
 * @returns APR as a decimal number (e.g., 0.15 for 15%)
 */
export const calculateStakingApr = (eraRewards: bigint[], eraTotalStakes: bigint[], babeApi: ApiPromise): number => {
  const totalRewards = eraRewards.reduce((acc, reward) => acc + reward, 0n)
  const totalStakes = eraTotalStakes.reduce((acc, stake) => acc + stake, 0n)

  const erasPerYear = getStakingErasPerYear(babeApi)
  const RATIO_DIGITS = 10000n

  const bigapr = (RATIO_DIGITS * erasPerYear * totalRewards) / totalStakes
  const apr = Number(bigapr) / Number(RATIO_DIGITS)

  return apr
}
