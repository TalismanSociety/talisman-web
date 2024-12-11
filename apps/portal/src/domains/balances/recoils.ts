// TODO: nuke everything and re-write balances lib integration
import { Balances } from '@talismn/balances'
import { atom, selector } from 'recoil'

import { portfolioAccountsState, selectedAccountsState, writeableAccountsState } from '@/domains/accounts/recoils'

import { selectedCurrencyState } from './currency'

export const balancesState = atom<Balances>({
  key: 'Balances',
  default: new Balances([]),
  dangerouslyAllowMutability: true,
})

export const fiatBalanceGetterState = selector({
  key: 'FiatBalanceGetter',
  get: ({ get }) => {
    const balances = get(balancesState)
    const currency = get(selectedCurrencyState)
    return (address: string) => balances.find({ address }).sum.fiat(currency)
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const selectedBalancesState = selector({
  key: 'SelectedBalances',
  get: ({ get }) => {
    const accounts = get(selectedAccountsState).map(x => x.address)
    return new Balances(get(balancesState).sorted.filter(x => accounts.includes(x.address)))
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const selectedBalancesFiatSumState = selector({
  key: 'SelectedBalancesFiatSum',
  get: ({ get }) => get(selectedBalancesState).sum.fiat(get(selectedCurrencyState)),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const portfolioBalancesState = selector({
  key: 'PortfolioBalances',
  get: ({ get }) => {
    const accounts = get(portfolioAccountsState).map(x => x.address)
    return new Balances(get(balancesState).sorted.filter(x => accounts.includes(x.address)))
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const portfolioBalancesFiatSumState = selector({
  key: 'PortfolioBalancesFiatSum',
  get: ({ get }) => get(portfolioBalancesState).sum.fiat(get(selectedCurrencyState)),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const writeableBalancesState = selector({
  key: 'WritableBalances',
  get: ({ get }) => {
    const accounts = get(writeableAccountsState).map(x => x.address)
    return new Balances(get(balancesState).sorted.filter(x => accounts.includes(x.address)))
  },
  dangerouslyAllowMutability: true,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export type CoinGeckoErc20Coin = {
  id: string
  symbol: string
  name: string
  asset_platform_id: string
  contract_address: string
  image: {
    thumb: string
    small: string
    large: string
  }
}
