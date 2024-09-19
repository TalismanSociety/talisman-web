import { ApiPromise } from '@polkadot/api'
import { FrameSystemAccountInfo } from '@polkadot/types/lookup'
import { Decimal } from '@talismn/math'
import { BigMath } from '@talismn/util'

export const computeSubstrateBalance = (api: ApiPromise, account: FrameSystemAccountInfo) => {
  const ed = api.consts.balances.existentialDeposit
  const reserved = account.data.reserved.toBigInt()
  const frozen = account.data.frozen.toBigInt()
  const untouchable = BigMath.max(frozen - reserved, 0n)
  const free = account.data.free.toBigInt()
  const transferableBN = BigMath.max(free - untouchable, 0n)

  const decimals = api.registry.chainDecimals[0] ?? 10
  const symbol = api.registry.chainTokens[0] ?? 'DOT'
  const transferrable = Decimal.fromPlanck(transferableBN, decimals, { currency: symbol })
  const stayAlive = Decimal.fromPlanck(free - ed.toBigInt(), decimals, { currency: symbol })
  return { transferrable, stayAlive }
}
