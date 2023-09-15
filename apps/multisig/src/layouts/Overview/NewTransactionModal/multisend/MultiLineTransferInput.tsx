import { useState, useMemo, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { css } from '@emotion/css'
import truncateMiddle from 'truncate-middle'
import { Address } from '@util/addresses'
import { formatUnits, parseUnits } from '@util/numbers'
import { BaseToken, tokenPriceState } from '@domains/chains'
import { MultiSendSend } from './multisend.types'
import { useRecoilValueLoadable } from 'recoil'
import AmountUnitSelector, { AmountUnit } from '@components/AmountUnitSelector'
import BN from 'bn.js'

type Props = {
  label?: string
  token?: BaseToken
  sends: MultiSendSend[]
  onChange: (rows: MultiSendSend[], invalidRows: number[]) => void
}

const theme = createTheme({
  theme: 'dark',
  settings: {
    background: 'var(--color-grey800)',
    foreground: 'var(--color-grey800)',
    selection: 'var(--color-backgroundLight)',
    gutterBackground: 'var(--color-grey800)',
    selectionMatch: 'var(--color-backgroundLight)',
    gutterActiveForeground: 'var(--color-offWhite)',
    caret: 'var(--color-primary)',
    gutterForeground: 'var(--color-dim)',
  },
  styles: [{ tag: tags.content, color: 'var(--color-offWhite)' }],
})

const findAddressAndAmount = (
  row: string,
  parseAmount: (amount: string) => BN
): { address: Address; addressString: string; amount: string; amountBn: BN } | undefined => {
  // try format "address, amount"
  let [address, amount] = row.split(',')

  // try format "address amount"
  if (!address || !amount) {
    ;[address, amount] = row.split(' ')
  }

  // try format "address  amount"
  if (!address || !amount) {
    ;[address, amount] = row.split('  ')
  }

  if (!address || !amount) return undefined

  const trimmedAddress = address.trim()
  const trimmedAmount = amount.trim()

  const parsedAddress = Address.fromSs58(trimmedAddress)
  if (parsedAddress === false || isNaN(parseFloat(amount))) return undefined

  return {
    address: parsedAddress,
    addressString: trimmedAddress,
    amount: trimmedAmount,
    amountBn: parseAmount(trimmedAmount),
  }
}

const MultiLineTransferInput: React.FC<Props> = ({
  label = 'Enter one address and amount on each line.',
  onChange,
  token,
  sends,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [amountUnit, setAmountUnit] = useState<AmountUnit>(AmountUnit.Token)
  const tokenPrices = useRecoilValueLoadable(tokenPriceState(token))

  const transferRows = useMemo(
    () =>
      value.split('\n').map(row => ({
        input: row,
        validRow: findAddressAndAmount(row, amount => {
          if (!token) return new BN(0)

          let tokenAmount = amount

          if (amountUnit !== AmountUnit.Token) {
            if (tokenPrices.state === 'hasValue') {
              if (amountUnit === AmountUnit.UsdMarket) {
                tokenAmount = (parseFloat(amount) / tokenPrices.contents.current).toString()
              } else if (amountUnit === AmountUnit.Usd7DayEma) {
                if (!tokenPrices.contents.averages?.ema7) throw Error('Unexpected missing ema7!')
                tokenAmount = (parseFloat(amount) / tokenPrices.contents.averages.ema7).toString()
              } else if (amountUnit === AmountUnit.Usd30DayEma) {
                if (!tokenPrices.contents.averages?.ema30) throw Error('Unexpected missing ema30!')
                tokenAmount = (parseFloat(amount) / tokenPrices.contents.averages.ema30).toString()
              }
            } else {
              return new BN(0)
            }
          }

          return parseUnits(tokenAmount, token.decimals)
        }),
      })),
    [amountUnit, token, tokenPrices, value]
  )

  const augmentedValue = useMemo(() => {
    // format the input when user is not editing
    return editing
      ? value
      : transferRows
          .map(({ validRow, input }) => {
            // for invalid rows, we allow empty line for grouping, otherwise we warn user of invalid row
            if (!validRow) return input === '' ? '' : '!! invalid format'
            let formattedString = `${truncateMiddle(validRow.addressString, 6, 6, '...')}`
            if (amountUnit !== AmountUnit.Token) {
              formattedString += `, ${validRow.amount} USD`
              if (token)
                formattedString += ` (${(+formatUnits(validRow.amountBn, token.decimals)).toFixed(4)} ${token.symbol})`
            } else {
              formattedString += `, ${validRow.amount} ${token?.symbol}`
            }
            return formattedString
          })
          .join('\n')
  }, [editing, value, transferRows, amountUnit, token])

  const invalidRows = useMemo(() => {
    let indexes = []

    for (let i = 0; i < transferRows.length; i++) {
      if (!transferRows[i]?.validRow && transferRows[i]?.input !== '') indexes.push(i)
    }
    return indexes
  }, [transferRows])

  const validRows = useMemo(() => {
    if (!token) return undefined

    return transferRows
      .filter(r => !!r.validRow)
      .map(
        ({ validRow }) =>
          ({
            address: validRow!.address,
            amountBn: validRow!.amountBn,
            token,
          }!)
      )
  }, [token, transferRows])

  useEffect(() => {
    if (!validRows) return
    onChange(validRows, invalidRows)
  }, [invalidRows, onChange, sends, token, validRows])

  return (
    <div style={{ width: '100%' }}>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          width: '100%',
        }}
      >
        <p>{label}</p>
        {/** TODO: Add CSV import button */}
      </div>
      <div
        className={css`
          background: var(--color-grey800);
          border-radius: 12px;
          padding: 12px 4px;
          height: 200px;
          overflow: auto;
          width: 100%;
          .cm-activeLine {
            background: var(--color-grey800);
          }
          .cm-line {
            color: white;
          }
        `}
      >
        <CodeMirror
          onBlur={() => setEditing(false)}
          onChange={v => setValue(v)}
          onFocus={() => setEditing(true)}
          placeholder="14JVAW...Vkbg5, 10.42856"
          theme={theme}
          value={augmentedValue}
        />
      </div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 8,
          fontSize: 11,
        }}
      >
        {tokenPrices.state === 'hasError' ? (
          'Error fetching EMA price info'
        ) : tokenPrices.state === 'loading' ? (
          'Loading...'
        ) : tokenPrices.state === 'hasValue' && tokenPrices.contents.averages ? (
          <AmountUnitSelector value={amountUnit} onChange={setAmountUnit} />
        ) : (
          'EMA input is not avaliable for this token'
        )}
      </div>
    </div>
  )
}

export default MultiLineTransferInput
