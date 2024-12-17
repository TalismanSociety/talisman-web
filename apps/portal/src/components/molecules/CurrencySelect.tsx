import { Select } from '@talismn/ui/molecules/Select'
import { useRecoilState } from 'recoil'

import { currencyConfig, selectedCurrencyState } from '@/domains/balances/currency'

export const CurrencySelect = () => {
  const [currency, setCurrency] = useRecoilState(selectedCurrencyState)
  return (
    <Select value={currency} onChangeValue={setCurrency} detached>
      {Object.entries(currencyConfig).map(([currency, config]) => (
        <Select.Option
          key={currency}
          value={currency}
          leadingIcon={config.unicodeCharacter}
          headlineContent={config.name}
        />
      ))}
    </Select>
  )
}
