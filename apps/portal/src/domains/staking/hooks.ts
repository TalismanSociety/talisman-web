import { selectedBalancesState, selectedCurrencyState } from '../balances'
import { useTotalStaked as useDappStakingTotalStaked } from './dappStaking'
import { lidoSuitesState } from './lido/recoils'
import { slpxPairsState } from './slpx'
import { useTotalStaked as useSubstrateTotalStaked } from './substrate/useTotalStaked'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

export const useTotalStaked = () => {
  const [lidoSuites, slpxPairs, balances, currency] = useRecoilValue(
    waitForAll([lidoSuitesState, slpxPairsState, selectedBalancesState, selectedCurrencyState])
  )
  const { fiatTotal: substrateFiatTotal } = useSubstrateTotalStaked()
  const dappStakingTotal = useDappStakingTotalStaked()

  return useMemo(
    () =>
      balances
        .find(
          x =>
            x.token?.symbol !== undefined &&
            [
              ...lidoSuites.map(lido => lido.token.symbol as string),
              ...slpxPairs.map(slpx => slpx.vToken.symbol as string),
            ].includes(x.token?.symbol)
        )
        .sum.fiat(currency).total +
      substrateFiatTotal +
      dappStakingTotal,
    [balances, currency, dappStakingTotal, lidoSuites, slpxPairs, substrateFiatTotal]
  )
}
