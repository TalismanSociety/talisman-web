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
 * Number of eras a nominator (including nomination-pool bonded accounts, which are pure nominators)
 * must wait to unbond.
 *
 * Since Polkadot referendum 1910, when nominators are not slashable they unbond in
 * `NominatorFastUnbondDuration` eras (e.g. 2 on Polkadot Asset Hub) instead of the full
 * `BondingDuration` (28). When the fast-unbond constant is absent, or nominators are still
 * slashable, the normal bonding duration applies.
 *
 * @param areNominatorsSlashable - on-chain `staking.areNominatorsSlashable` value
 */
export const getNominatorBondingDurationEras = (stakingApi: ApiPromise, areNominatorsSlashable: boolean): number => {
  const fastUnbondDuration = (
    stakingApi.consts.staking as unknown as Record<string, { toNumber: () => number } | undefined>
  )['nominatorFastUnbondDuration']

  if (fastUnbondDuration !== undefined && !areNominatorsSlashable) {
    return fastUnbondDuration.toNumber()
  }

  return stakingApi.consts.staking.bondingDuration.toNumber()
}

/**
 * Calculates the staking bonding duration in milliseconds
 * @param stakingApi - ApiPromise for the chain holding the staking pallet
 * @param babeApi - ApiPromise exposing the babe constants (relay chain for parachains)
 * @param areNominatorsSlashable - on-chain `staking.areNominatorsSlashable` value (see
 *   {@link getNominatorBondingDurationEras})
 * @returns Bonding duration in milliseconds
 */
export const getStakingBondingDurationMs = ({
  stakingApi,
  babeApi,
  areNominatorsSlashable,
}: {
  stakingApi: ApiPromise
  babeApi: ApiPromise | null
  areNominatorsSlashable: boolean
}): bigint => {
  if (!babeApi) {
    console.error('Babe API is null')
    return 0n
  }

  const bondingDuration = getNominatorBondingDurationEras(stakingApi, areNominatorsSlashable)
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

  if (totalStakes === 0n || totalRewards === 0n) {
    return 0
  }

  const erasPerYear = getStakingErasPerYear(babeApi)
  const RATIO_DIGITS = 10000n

  const bigapr = (RATIO_DIGITS * erasPerYear * totalRewards) / totalStakes
  const apr = Number(bigapr) / Number(RATIO_DIGITS)

  return apr
}
