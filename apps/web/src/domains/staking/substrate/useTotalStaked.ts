import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { chainsState, nativeTokenPriceState } from '@domains/chains/recoils'
import { chainDeriveState, chainQueryState, substrateApiState } from '@domains/common'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll, waitForAny } from 'recoil'

export const useSubstrateFiatTotalStaked = () => {
  const [chains, accounts] = useRecoilValue(waitForAll([chainsState, selectedSubstrateAccountsState]))
  const addresses = useMemo(() => accounts.map(x => x.address), [accounts])
  const nativeTokenPrices = useRecoilValue(
    waitForAll(chains.map(chain => nativeTokenPriceState({ genesisHash: chain.genesisHash })))
  )

  const apis = useRecoilValue(waitForAll(chains.map(x => substrateApiState(x.rpc))))
  const decimals = apis.map(x => x.registry.chainDecimals.at(0) ?? 0)

  const [validatorStakes, poolStakes] = useRecoilValue(
    waitForAny([
      waitForAny(chains.map(x => chainDeriveState(x.rpc, 'staking', 'accounts', [addresses, undefined]))),
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
                ? x.loadable.contents.reduce((prev, curr) => prev + curr.stakingLedger.active.toBigInt(), 0n)
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
                    .flatMap(x => x.points)
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
