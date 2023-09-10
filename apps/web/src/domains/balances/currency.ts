import { storageEffect } from '@domains/common/effects'
import { type TokenRateCurrency } from '@talismn/token-rates'
import { atom } from 'recoil'

export const currencyConfig: Partial<Record<TokenRateCurrency, { unicodeCharacter: string; name: string }>> = {
  usd: {
    unicodeCharacter: '$',
    name: 'US Dollar',
  },
  aud: {
    unicodeCharacter: '$',
    name: 'Australian Dollar',
  },
  eur: {
    unicodeCharacter: '€',
    name: 'Euro',
  },
  gbp: {
    unicodeCharacter: '£',
    name: 'British Pound',
  },
  jpy: {
    unicodeCharacter: '¥',
    name: 'Japanese Yen',
  },
  cny: {
    unicodeCharacter: '¥',
    name: 'Chinese Yuan',
  },
  // rub: {
  //   unicodeCharacter: '₽',
  //   name: 'Russian Ruble',
  // },
  btc: {
    unicodeCharacter: '₿',
    name: 'Bitcoin',
  },
  eth: {
    unicodeCharacter: 'Ξ',
    name: 'Ethereum',
  },
  dot: {
    unicodeCharacter: 'D',
    name: 'Polkadot',
  },
}

export const selectedCurrencyState = atom<TokenRateCurrency>({
  key: 'selected-currency',
  default: 'usd',
  effects: [storageEffect(localStorage)],
})
