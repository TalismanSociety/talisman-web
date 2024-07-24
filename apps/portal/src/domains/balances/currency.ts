import { storageEffect } from '../common/effects'
import { jsonParser, stringLiterals } from '@recoiljs/refine'
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
  effects: [
    storageEffect(localStorage, {
      parser: jsonParser(
        stringLiterals({
          usd: 'usd',
          aud: 'aud',
          nzd: 'nzd',
          eur: 'eur',
          gbp: 'gbp',
          jpy: 'jpy',
          krw: 'krw',
          cny: 'cny',
          rub: 'rub',
          btc: 'btc',
          eth: 'eth',
          dot: 'dot',
          cad: 'cad',
          idr: 'idr',
          inr: 'inr',
          php: 'php',
          sgd: 'sgd',
          thb: 'thb',
          try: 'try',
          vnd: 'vnd',
        } satisfies Record<TokenRateCurrency, TokenRateCurrency>)
      ),
    }),
  ],
})
