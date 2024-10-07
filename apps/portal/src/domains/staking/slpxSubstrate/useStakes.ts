import { SlpxSubstratePair } from './types'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { Account } from '@/domains/accounts/recoils'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { Decimal } from '@talismn/math'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

const defaultCurrency = 'usd'
const vTokenDecimals = 10

const useStakes = ({ slpxSubstratePair }: { slpxSubstratePair: SlpxSubstratePair }) => {
  const accountsLoadable = useRecoilValueLoadable(selectedSubstrateAccountsState)
  const accounts = accountsLoadable.valueMaybe()
  const { state: loadableState, contents: loadableContents } = useRecoilValueLoadable(
    waitForAll([selectedBalancesState, selectedCurrencyState])
  )
  const [balances, currency] = loadableState === 'hasValue' ? loadableContents : []

  const data = accounts?.map(account => {
    const balance = balances?.find(
      x =>
        x.token?.symbol.toLowerCase() === slpxSubstratePair.vToken.symbol.toLowerCase() && x.address === account.address
    )
    const formattedBalance = Decimal.fromPlanck(balance?.sum.planck.total ?? 0n, vTokenDecimals, {
      currency: slpxSubstratePair.vToken.symbol,
    })
    const fiatBalance = balance?.sum.fiat(currency ?? defaultCurrency).total
    const unlocking = 999
    return { account: account as Account, balance: formattedBalance, fiatBalance, unlocking }
  })
  return data
}

export default useStakes
