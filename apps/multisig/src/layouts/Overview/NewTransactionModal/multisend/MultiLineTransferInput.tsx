import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
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
import FileUploadButton from '../../../../components/FileUploadButton'
import { toast } from 'react-hot-toast'

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

  // try format "address[tab]amount"
  if (!address || !amount) {
    ;[address, amount] = row.split('\t')
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

const findIndexFromCsvRow = (row: string[], keywords: string[]): number => {
  let index = -1
  for (let i = 0; i < keywords.length; i++) {
    index = row.indexOf(keywords[i] as string)
    if (index !== -1) break
  }
  return index
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

  const parseAmount = useCallback(
    (amount: string) => {
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
    },
    [amountUnit, token, tokenPrices]
  )

  /* A list of rows that are formatted and validated. */
  const formattedRows = useMemo(
    () =>
      value.split('\n').map(row => ({
        input: row,
        validRow: findAddressAndAmount(row, parseAmount),
      })),
    [parseAmount, value]
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

  const handleCsvUpload = async (files: File[]) => {
    const file = files[0]
    if (!file || !token) return
    const textValue = await file.text()

    const rows = textValue.split('\n')
    const headerLine = rows[0]?.toLowerCase().split(',')
    if (!headerLine) return toast.error('The uploaded file does not have a header row.', { duration: 5000 })

    // try to find the token address and amount columns.
    // to be adjusted as we learn more about common CSV formats
    const addressIndex = findIndexFromCsvRow(headerLine, ['address', 'to', 'recipient', 'receiver'])
    const amountIndex = findIndexFromCsvRow(headerLine, [token.symbol.toLowerCase(), 'token amount', 'amount', 'value'])

    if (addressIndex === -1)
      return toast.error('Address column not found. Make sure the column for recipient is "Address".', {
        duration: 5000,
      })
    if (amountIndex === -1)
      return toast.error(`Amount column not found. Make sure the column for amount is ${token.symbol} or "Amount".`, {
        duration: 5000,
      })

    const values: string[] = []
    rows.forEach((row, i) => {
      if (i === 0) return
      const rowValues = row.split(',')
      const addressString = rowValues[addressIndex]
      const amountString = rowValues[amountIndex]

      // skip rows that don't have address or amount
      if (!addressString || !amountString) return

      values.push(`${addressString}, ${amountString}`)
    })

    if (values.length === 0) return toast.error('The uploaded file does not have any valid rows.', { duration: 5000 })
    setValue(values.join('\n'))
  }

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
          justifyContent: 'space-between',
          marginBottom: '16px',
          width: '100%',
        }}
      >
        <p>{label}</p>
        <FileUploadButton label="Import CSV" accept="text/csv" multiple={false} onFiles={handleCsvUpload} />
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
