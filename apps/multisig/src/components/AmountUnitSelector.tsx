import { css } from '@emotion/css'
import { Fragment } from 'react'

export enum AmountUnit {
  Token,
  UsdMarket,
  Usd7DayEma,
  Usd30DayEma,
}

type Props = {
  value: AmountUnit
  onChange: (value: AmountUnit) => void
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

const AmountUnitSelector: React.FC<Props> = ({ onChange, value: selectedAmountUnit }) => (
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

export default AmountUnitSelector
