import { useState, useMemo, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { css } from '@emotion/css'
import truncateMiddle from 'truncate-middle'
import { Address } from '@util/addresses'
import { BaseToken } from '@domains/chains'
import { MultiSendSend } from './multisend.types'

type Props = {
  label?: string
  token?: BaseToken
  onChange: (rows: Required<MultiSendSend>[]) => void
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

const findAddressAndAmount = (row: string): { address: Address; addressString: string; amount: string } | undefined => {
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

  return { address: parsedAddress, addressString: trimmedAddress, amount: trimmedAmount }
}

const MultiLineTransferInput: React.FC<Props> = ({
  label = 'Enter one address and amount on each line.',
  onChange,
  token,
}) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')

  const transferRows = useMemo(
    () => value.split('\n').map(row => ({ input: row, validRow: findAddressAndAmount(row) })),
    [value]
  )

  const augmentedValue = useMemo(() => {
    // format the input when user is not editing
    return editing
      ? value
      : transferRows
          .map(({ validRow, input }) =>
            validRow ? `${truncateMiddle(validRow.addressString, 6, 6, '...')}, ${validRow.amount}` : input
          )
          .join('\n')
  }, [editing, value, transferRows])

  useEffect(() => {
    if (!token) return

    // only call onChange with valid rows
    onChange(
      transferRows
        .filter(r => !!r.validRow)
        .map(
          ({ validRow }) =>
            ({
              address: validRow!.address,
              amount: validRow!.amount,
              token,
            }!)
        )
    )
  }, [onChange, token, transferRows])

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
    </div>
  )
}

export default MultiLineTransferInput
