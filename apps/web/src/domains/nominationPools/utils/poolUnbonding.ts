import { DeriveSessionProgress } from '@polkadot/api-derive/session/types'
import { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import BN from 'bn.js'

export const getPoolUnbonding = (
  poolMember: PalletNominationPoolsPoolMember,
  sessionProgress: DeriveSessionProgress
) => {
  const all = Array.from(poolMember.unbondingEras.entries(), ([era, amount]) => ({
    amount: amount.toBigInt(),
    erasTilWithdrawable: era.lte(sessionProgress.activeEra) ? undefined : era.sub(sessionProgress.activeEra),
  }))

  const withdrawable = all
    .filter(x => x.erasTilWithdrawable === undefined)
    .reduce((previous, current) => previous + current.amount, 0n)

  const unbondings = all.filter(
    (x): x is { amount: bigint; erasTilWithdrawable: BN } => x.erasTilWithdrawable !== undefined
  )

  return { withdrawable, unbondings }
}
