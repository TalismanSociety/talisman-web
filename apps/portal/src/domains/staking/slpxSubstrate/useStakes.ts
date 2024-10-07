import { SlpxSubstratePair } from './types'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import {
  selectedBalancesState, // selectedCurrencyState
} from '@/domains/balances'
import { Decimal } from '@talismn/math'
import { useRecoilValueLoadable } from 'recoil'

const useStakes = ({ slpxSubstratePair }: { slpxSubstratePair: SlpxSubstratePair }) => {
  const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)
  const accounts = accountsLoadable.valueMaybe()
  const balancesLoadable = useRecoilValueLoadable(selectedBalancesState)
  const balances = balancesLoadable.valueMaybe()

  const vTokenDecimals = 10

  const data = accounts?.map(account => {
    const balance = balances?.find(
      x =>
        x.token?.symbol.toLowerCase() === slpxSubstratePair.vToken.symbol.toLowerCase() && x.address === account.address
    )
    const formattedBalance = Decimal.fromPlanck(balance?.sum.planck.total ?? 0n, vTokenDecimals, {
      currency: slpxSubstratePair.vToken.symbol,
    })
    const fiatBalance = 123
    const unlocking = 999
    return { account, balance: formattedBalance, fiatBalance, unlocking }
  })
  return data
}

export default useStakes
