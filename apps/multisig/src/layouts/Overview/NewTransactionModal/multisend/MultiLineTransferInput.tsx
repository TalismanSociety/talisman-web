import { useState, useMemo, useEffect, useRef } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
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
import { useOnClickOutside } from '../../../../domains/common/useOnClickOutside'

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
  if (parsedAddress === false || trimmedAmount === '' || isNaN(+trimmedAmount)) return undefined

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
  // the native onBlur/onFocus of CodeMiror is a bit buggy, so we use this custom hook to detect blur
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null)
  useOnClickOutside(codeMirrorRef.current?.editor, () => setEditing(false))

  /* A list of rows that are formatted and validated. */
  const formattedRows = useMemo(
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

  /**
   * A formatted string that is displayed in the CodeMirror editor.
   * Shows formatted address and amount if user is not editing
   */
  const augmentedValue = useMemo(() => {
    return editing
      ? value
      : formattedRows
          .map(({ validRow, input }) => {
            // for invalid rows, we allow empty line for grouping, otherwise we warn user of invalid row
            if (!validRow) return input === '' ? '' : `!! invalid format: ${input}`
            const addressToFormat = token ? validRow.address.toSs58(token.chain) : validRow.addressString
            let formattedString = `${truncateMiddle(addressToFormat, 6, 6, '...')}`

            // figure out the right token / usd amount to display
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
  }, [editing, value, formattedRows, amountUnit, token])

  const invalidRows = useMemo(() => {
    const indexes: number[] = []
    formattedRows.forEach(({ validRow, input }, i) => {
      if (!validRow && input !== '') indexes.push(i + 1)
    })
    return indexes
  }, [formattedRows])

  const validRows = useMemo(() => {
    if (!token) return undefined
    return formattedRows
      .filter(r => !!r.validRow)
      .map(
        ({ validRow }) =>
          ({
            address: validRow!.address,
            amountBn: validRow!.amountBn,
            token,
          }!)
      )
  }, [token, formattedRows])

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
          ref={codeMirrorRef}
          onChange={editing ? setValue : undefined}
          onClick={() => setEditing(true)}
          editable={editing}
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
      {invalidRows.length > 0 && (
        <p
          css={{
            color: 'var(--color-status-error)',
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          {invalidRows.length > 6
            ? 'Many lines have invalid format.'
            : `Invalid format at line ${invalidRows.join(', ')}`}
        </p>
      )}
    </div>
  )
}

export default MultiLineTransferInput
