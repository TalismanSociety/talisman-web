import { BaseToken, tokenPriceState } from '@domains/chains'
import { css } from '@emotion/css'
import { Select, TextInput } from '@talismn/ui'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import AmountUnitSelector, { AmountUnit } from '../AmountUnitSelector'

export const AmountFlexibleInput = (props: {
  tokens: BaseToken[]
  selectedToken: BaseToken | undefined
  amount: string
  leadingLabel?: string
  setAmount: (a: string) => void
  setSelectedToken?: (t: BaseToken) => void
}) => {
  const [input, setInput] = useState<string>('')
  const [amountUnit, setAmountUnit] = useState<AmountUnit>(AmountUnit.Token)
  const tokenPrices = useRecoilValueLoadable(tokenPriceState(props.selectedToken))

  useEffect(() => {
    setAmountUnit(AmountUnit.Token)
  }, [props.selectedToken])

  const calculatedTokenAmount = useMemo((): string | undefined => {
    if (amountUnit === AmountUnit.Token) {
      return input
    }

    if (tokenPrices.state === 'hasValue') {
      if (amountUnit === AmountUnit.UsdMarket) {
        return (parseFloat(input) / tokenPrices.contents.current).toString()
      } else if (amountUnit === AmountUnit.Usd7DayEma) {
        if (!tokenPrices.contents.averages?.ema7) throw Error('Unexpected missing ema7!')
        return (parseFloat(input) / tokenPrices.contents.averages.ema7).toString()
      } else if (amountUnit === AmountUnit.Usd30DayEma) {
        if (!tokenPrices.contents.averages?.ema30) throw Error('Unexpected missing ema30!')
        return (parseFloat(input) / tokenPrices.contents.averages.ema30).toString()
      }
      throw Error('Unexpected amount unit')
    }

    return '0'
  }, [amountUnit, input, tokenPrices])

  useEffect(() => {
    if (calculatedTokenAmount || calculatedTokenAmount === '') {
      props.setAmount(calculatedTokenAmount)
    }
  }, [calculatedTokenAmount, props])

  const unit = useMemo(() => {
    if (amountUnit === AmountUnit.Token) {
      return props.selectedToken?.symbol
    } else {
      return 'USD'
    }
  }, [amountUnit, props.selectedToken])

  return (
    <div css={{ display: 'flex', width: '100%', gap: '12px' }}>
      <div
        className={css`
          display: 'flex';
          flex-grow: 1;
          align-items: center;
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder={`0 ${unit}`}
          leadingLabel={props.leadingLabel ?? `Amount to send`}
          trailingLabel={
            calculatedTokenAmount && calculatedTokenAmount !== 'NaN' && amountUnit !== AmountUnit.Token
              ? `Amount in ${props.selectedToken?.symbol}: ${calculatedTokenAmount}`
              : ''
          }
          leadingSupportingText={
            <AmountUnitSelector value={amountUnit} onChange={setAmountUnit} tokenPrices={tokenPrices} />
          }
          value={input}
          onChange={event => {
            if (!props.selectedToken) return

            // Create a dynamic regular expression.
            // This regex will:
            // - Match any string of up to `digits` count of digits, optionally separated by a decimal point.
            // - The total count of digits, either side of the decimal point, can't exceed `digits`.
            // - It will also match an empty string, making it a valid input.
            const digits = props.selectedToken.decimals
            let regex = new RegExp(
              '^(?:(\\d{1,' +
                digits +
                '})|(\\d{0,' +
                (digits - 1) +
                '}\\.\\d{1,' +
                (digits - 1) +
                '})|(\\d{1,' +
                (digits - 1) +
                '}\\.\\d{0,' +
                (digits - 1) +
                '})|^$)$'
            )
            if (regex.test(event.target.value)) {
              setInput(event.target.value)
            }
          }}
        />
      </div>
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: center;
          height: max-content;
          margin-top: 25px;
          button {
            height: 53.5px;
            gap: 8px;
            > div {
              display: flex;
              justify-content: center;
              margin-top: 2px;
              width: 100%;
            }
            svg {
              display: none;
            }
          }
        `}
      >
        <Select
          placeholder="Select token"
          value={props.selectedToken?.id}
          {...props}
          onChange={id => props.setSelectedToken?.(props.tokens.find(t => t.id === id) as BaseToken)}
          width={'100%'}
        >
          {props.tokens.map(t => {
            return (
              <Select.Item
                key={t.id}
                value={t.id}
                leadingIcon={
                  <div
                    className={css`
                      width: 24px;
                      height: auto;
                    `}
                  >
                    <img
                      className={css`
                        max-width: 100%; // image width will not exceed parent's width
                        max-height: 100%; // image height will not exceed parent's height
                      `}
                      src={t.logo}
                      alt={t.symbol}
                    />
                  </div>
                }
                headlineText={t.symbol}
              />
            )
          })}
        </Select>
      </div>
    </div>
  )
}
