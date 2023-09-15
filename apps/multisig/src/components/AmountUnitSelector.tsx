import { css } from '@emotion/css'
import { Fragment } from 'react'
import { Loadable } from 'recoil'
import { Price } from '../domains/chains'

export enum AmountUnit {
  Token,
  UsdMarket,
  Usd7DayEma,
  Usd30DayEma,
}

type Props = {
  value: AmountUnit
  onChange: (value: AmountUnit) => void
  tokenPrices: Loadable<Price>
}

const unitOptions = [
  {
    name: 'Tokens',
    value: AmountUnit.Token,
  },
  {
    name: 'Market (USD)',
    value: AmountUnit.UsdMarket,
  },
  {
    name: '7D EMA (USD)',
    value: AmountUnit.Usd7DayEma,
  },
  {
    name: '30D EMA (USD)',
    value: AmountUnit.Usd30DayEma,
  },
]

const AmountUnitSelector: React.FC<Props> = ({ onChange, value: selectedAmountUnit, tokenPrices }) => {
  if (tokenPrices.state === 'hasValue' && tokenPrices.contents.averages)
    return (
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          p {
            font-size: 11px;
          }
        `}
      >
        <p>Unit:</p>
        {unitOptions.map(({ name, value }) => (
          <Fragment key={value}>
            <p
              onClick={() => onChange(value)}
              css={
                selectedAmountUnit === value
                  ? { fontWeight: 'bold', marginTop: -2, cursor: 'pointer', color: 'var(--color-offWhite)' }
                  : { cursor: 'pointer' }
              }
            >
              {name}
            </p>
            <span css={{ 'fontSize': 12, ':last-child': { display: 'none' } }}>|</span>
          </Fragment>
        ))}
      </div>
    )

  return (
    <p css={{ fontSize: 12 }}>
      {tokenPrices.state === 'loading'
        ? 'Loading...'
        : tokenPrices.state === 'hasError'
        ? 'Error fetching EMA price info'
        : 'EMA input is not available for this token'}
    </p>
  )
}

export default AmountUnitSelector
