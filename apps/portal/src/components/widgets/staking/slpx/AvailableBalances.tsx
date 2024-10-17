import { selectedBalancesState, selectedCurrencyState } from '../../../../domains/balances'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import RedactableBalance from '../../RedactableBalance'
import { SlpxPair } from '@/domains/staking/slpx'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export const useAvailableBalance = (slpxPair: SlpxPair | SlpxSubstratePair, isSubstrate?: boolean) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const nativeBalance = isSubstrate
    ? balances.find(
        x =>
          //@ts-expect-error
          x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase() && x.chainId === slpxPair.chainId
      )
    : balances.find(x => x.token?.symbol.toLowerCase() === slpxPair.nativeToken.symbol.toLowerCase())

  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(nativeBalance.sum.planck.transferable ?? 0n, nativeBalance.each.at(0)?.decimals ?? 0, {
        currency: slpxPair.nativeToken.symbol,
      }).toLocaleString(),
      fiatAmount: nativeBalance.sum.fiat(currency).total,
    }),
    [currency, nativeBalance.each, nativeBalance.sum, slpxPair.nativeToken.symbol]
  )
}

export const AvailableBalance = (props: { slpxPair: SlpxPair | SlpxSubstratePair; isSubstrate?: boolean }) => (
  <RedactableBalance>{useAvailableBalance(props.slpxPair, props.isSubstrate).amount}</RedactableBalance>
)

export const AvailableFiatBalance = (props: { slpxPair: SlpxPair | SlpxSubstratePair; isSubstrate?: boolean }) => (
  <AnimatedFiatNumber end={useAvailableBalance(props.slpxPair, props.isSubstrate).fiatAmount} />
)
