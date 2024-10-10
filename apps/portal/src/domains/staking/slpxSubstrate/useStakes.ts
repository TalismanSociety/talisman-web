import { Maybe } from '../../../util/monads'
import { SlpxSubstratePair } from './types'
import { selectedSubstrateAccountsState } from '@/domains/accounts'
import { Account } from '@/domains/accounts/recoils'
import { selectedBalancesState, selectedCurrencyState } from '@/domains/balances'
import { Decimal } from '@talismn/math'
import { useQueryState } from '@talismn/react-polkadot-api'
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
  const userUnlockLedgersLoadable = useRecoilValueLoadable(
    useQueryState(
      'vtokenMinting',
      'userUnlockLedger.multi',
      accounts?.map(x => [x.address ?? '', slpxSubstratePair.nativeToken.tokenId] as const) ?? []
    )
  )

  const userUnlockLedgers = userUnlockLedgersLoadable.valueMaybe()

  const isLoading =
    accountsLoadable.state === 'loading' || loadableState === 'loading' || userUnlockLedgersLoadable.state === 'loading'

  const stakes = accounts
    ?.map((account, index) => {
      const balance = balances?.find(
        x =>
          x.token?.symbol.toLowerCase() === slpxSubstratePair.vToken.symbol.toLowerCase() &&
          x.address === account.address
      )
      const formattedBalance = Decimal.fromPlanck(balance?.sum.planck.total ?? 0n, vTokenDecimals, {
        currency: slpxSubstratePair.vToken.symbol,
      })
      const fiatBalance = balance?.sum.fiat(currency ?? defaultCurrency).total ?? 0
      const unlocking = Maybe.of(userUnlockLedgers?.[index]?.unwrapOrDefault()).mapOrUndefined(x =>
        Decimal.fromPlanck(x[0].toBigInt(), vTokenDecimals ?? 0, { currency: slpxSubstratePair.vToken.symbol })
      )
      return { account: account as Account, balance: formattedBalance, fiatBalance, unlocking }
    })
    .filter(x => x.balance.planck !== 0n || (x.unlocking !== undefined && x.unlocking.planck !== 0n))
  return { stakes, isLoading }
}

export default useStakes
