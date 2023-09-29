import { substrateAccountsState } from '@domains/accounts/recoils'
import { chains } from '@domains/chains'
import { nativeTokenPriceState } from '@domains/chains/recoils'
import { chainQueryState, substrateApiState } from '@domains/common'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll, waitForAny } from 'recoil'

export const useSubstrateFiatTotalStaked = () => {
  const accounts = useRecoilValue(substrateAccountsState)
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const nativeTokenPrices = useRecoilValue(waitForAll(chains.map(chain => nativeTokenPriceState({ chain }))))

  const apis = useRecoilValue(waitForAll(chains.map(x => substrateApiState(x.rpc))))
  const decimals = apis.map(x => x.registry.chainDecimals.at(0) ?? 0)

  const [validatorStakes, poolStakes] = useRecoilValue(
    waitForAny([
      waitForAny(chains.map(x => chainQueryState(x.rpc, 'staking', 'ledger.multi', addresses))),
      waitForAny(chains.map(x => chainQueryState(x.rpc, 'nominationPools', 'poolMembers.multi', addresses))),
    ])
  )

  const validatorStakeFiatTotal =
    validatorStakes.state !== 'hasValue'
      ? 0
      : validatorStakes.contents
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((x, index) => ({ decimals: decimals[index]!, price: nativeTokenPrices[index]!, loadable: x }))
          .filter(x => x.loadable.state === 'hasValue')
          .map(x => ({
            price: x.price,
            decimals: x.decimals,
            amount:
              x.loadable.state === 'hasValue'
                ? x.loadable.contents.reduce((prev, curr) => prev + curr.unwrapOrDefault().total.toBigInt(), 0n)
                : 0n,
          }))
          .map(x => Decimal.fromPlanck(x.amount, x.decimals).toNumber() * x.price)
          .reduce((prev, curr) => prev + curr, 0)

  const poolStakeFiatTotal =
    poolStakes.state !== 'hasValue'
      ? 0
      : poolStakes.contents
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((x, index) => ({ decimals: decimals[index]!, price: nativeTokenPrices[index]!, loadable: x }))
          .filter(x => x.loadable.state === 'hasValue')
          .map(x => ({
            price: x.price,
            decimals: x.decimals,
            amount:
              x.loadable.state === 'hasValue'
                ? x.loadable.contents
                    .map(x => x.unwrapOrDefault())
                    .flatMap(x => [x.points, ...Array.from(x.unbondingEras.values())])
                    .map(x => x.toBigInt())
                    .reduce((prev, curr) => prev + curr, 0n)
                : 0n,
          }))
          .map(x => Decimal.fromPlanck(x.amount, x.decimals).toNumber() * x.price)
          .reduce((prev, curr) => prev + curr, 0)

  return {
    validatorStakeFiatTotal,
    poolStakeFiatTotal,
    fiatTotal: validatorStakeFiatTotal + poolStakeFiatTotal,
  }
}
