import { useRecoilValue, waitForAll } from 'recoil'
import { lidoSuitesState } from './lido/recoils'
import { slpxPairsState } from './slpx'
import { useSubstrateFiatTotalStaked } from './substrate/useTotalStaked'
import { selectedBalancesState, selectedCurrencyState } from '@domains/balances'
import { useMemo } from 'react'

export const useTotalStaked = () => {
  const [lidoSuites, slpxPairs, balances, currency] = useRecoilValue(
    waitForAll([lidoSuitesState, slpxPairsState, selectedBalancesState, selectedCurrencyState])
  )
  const { fiatTotal: substrateFiatTotal } = useSubstrateFiatTotalStaked()

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
        .sum.fiat(currency).total + substrateFiatTotal,
    [balances, currency, lidoSuites, slpxPairs, substrateFiatTotal]
  )
}
