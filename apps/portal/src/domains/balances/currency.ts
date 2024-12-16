import { jsonParser, stringLiterals } from '@recoiljs/refine'
import { type TokenRateCurrency } from '@talismn/token-rates'
import { atom } from 'recoil'

import { storageEffect } from '@/domains/common/effects'

export const currencyConfig: Partial<Record<TokenRateCurrency, { symbol: string; name: string }>> = {
  usd: { name: 'US Dollar', symbol: '$' },
  cny: { name: 'Chinese Yuan', symbol: 'CN¥' },
  eur: { name: 'Euro', symbol: '€' },
  gbp: { name: 'British Pound', symbol: '£' },
  cad: { name: 'Canadian Dollar', symbol: 'C$' },
  aud: { name: 'Australian Dollar', symbol: 'A$' },
  nzd: { name: 'New Zealand Dollar', symbol: 'NZ$' },
  jpy: { name: 'Japanese Yen', symbol: 'JP¥' },
  rub: { name: 'Russian Ruble', symbol: '₽' },
  krw: { name: 'South Korean Won', symbol: '₩' },
  idr: { name: 'Indonesian Rupiah', symbol: 'Rp' },
  php: { name: 'Philippine Peso', symbol: '₱' },
  thb: { name: 'Thai Baht', symbol: '฿' },
  vnd: { name: 'Vietnamese Dong', symbol: '₫' },
  inr: { name: 'Indian Rupee', symbol: '₹' },
  try: { name: 'Turkish Lira', symbol: '₺' },
  // hkd: { name: "Hong Kong Dollar", symbol: "HK$" },
  sgd: { name: 'Singapore Dollar', symbol: 'S$' },
  // twd: { name: "Taiwanese Dollar", symbol: "NT$" },
  btc: { name: 'Bitcoin', symbol: '₿' },
  eth: { name: 'Ethereum', symbol: 'Ξ' },
  dot: { name: 'Polkadot', symbol: 'D' },
}

export const selectedCurrencyState = atom<TokenRateCurrency>({
  key: 'selected-currency',
  default: 'usd',
  effects: [
    storageEffect(localStorage, {
      parser: jsonParser(
        stringLiterals({
          usd: 'usd',
          cny: 'cny',
          eur: 'eur',
          gbp: 'gbp',
          cad: 'cad',
          aud: 'aud',
          nzd: 'nzd',
          jpy: 'jpy',
          rub: 'rub',
          krw: 'krw',
          idr: 'idr',
          php: 'php',
          thb: 'thb',
          vnd: 'vnd',
          inr: 'inr',
          try: 'try',
          sgd: 'sgd',
          btc: 'btc',
          eth: 'eth',
          dot: 'dot',
        } satisfies Record<TokenRateCurrency, TokenRateCurrency>)
      ),
    }),
  ],
})
