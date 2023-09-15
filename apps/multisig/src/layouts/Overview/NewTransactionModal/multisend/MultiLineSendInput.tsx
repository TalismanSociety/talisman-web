import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { motion } from 'framer-motion'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { css } from '@emotion/css'
import truncateMiddle from 'truncate-middle'
import { Address } from '@util/addresses'
import { formatUnits, parseUnits } from '@util/numbers'
import { BaseToken, tokenPriceState } from '@domains/chains'
import { useOnClickOutside } from '@domains/common/useOnClickOutside'
import { MultiSendSend } from './multisend.types'
import { useRecoilValueLoadable } from 'recoil'
import AmountUnitSelector, { AmountUnit } from '@components/AmountUnitSelector'
import FileUploadButton from '@components/FileUploadButton'
import BN from 'bn.js'
import { Button, Tooltip } from '@talismn/ui'
import { Info } from '@talismn/icons'

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

/* try to find an address and amount from given string and perform required formatting */
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

  // try format "address[tab]amount", common for imported CSV
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

const MultiLineSendInput: React.FC<Props> = ({
  label = 'Enter one address and amount on each line.',
  onChange,
  token,
  sends,
}) => {
  const [amountUnit, setAmountUnit] = useState<AmountUnit>(AmountUnit.Token)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [importedFromCsv, setImportedFromCsv] = useState(false)
  const [value, setValue] = useState('')
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

  /* pre-process every row for validations later */
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
    if (editing) return value
    return formattedRows
      .map(({ validRow, input }) => {
        // for invalid rows, we allow empty line for grouping, otherwise we warn user of invalid row
        if (!validRow) return input === '' ? '' : `!! invalid format: ${input}`
        const addressToFormat = token ? validRow.address.toSs58(token.chain) : validRow.addressString
        let formattedString = `${truncateMiddle(addressToFormat, 6, 6, '...')}`

        // display the right token / usd amount
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
    setError(undefined)
    const textValue = await file.text()
    const rows = textValue.split('\n')
    const values: string[] = []

    rows.forEach(row => {
      const rowValues = row.split(',')
      const [addressString, amountString] = rowValues

      // skip rows that don't have address or amount
      if (!addressString || !amountString) return
      const validRow = findAddressAndAmount(`${addressString}, ${amountString}`, parseAmount)
      if (validRow) values.push(`${validRow.addressString}, ${validRow.amount}`)
    })

    if (values.length === 0) setError('The uploaded CSV file does not have a valid row.')
    setImportedFromCsv(values.length > 0)
    setValue(values.join('\n'))
  }

  useEffect(() => {
    if (validRows) onChange(validRows, invalidRows)
  }, [invalidRows, onChange, validRows])

  return (
    <div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <p>{label}</p>
        <div css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tooltip
            content={
              <div css={{ fontSize: 14, padding: 8 }}>
                <p css={{ fontSize: 14 }}>Format of CSV file:</p>
                <ul css={{ margin: 4, paddingLeft: 4 }}>
                  <li>First column should be address of recipients.</li>
                  <li>Second column should be amounts for each recipient.</li>
                </ul>
              </div>
            }
          >
            <Info size={16} />
          </Tooltip>
          <FileUploadButton label="Import CSV" accept="text/csv" multiple={false} onFiles={handleCsvUpload} />
        </div>
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
          onChange={val => {
            if (!editing) return
            setError(undefined)
            setValue(val)
          }}
          onClick={() => setEditing(true)}
          editable={editing && !importedFromCsv}
          placeholder="14JVAW...Vkbg5, 10.23456"
          theme={theme}
          value={augmentedValue}
        />
      </div>
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 8,
          height: 38,
        }}
      >
        <AmountUnitSelector tokenPrices={tokenPrices} value={amountUnit} onChange={setAmountUnit} />
        {importedFromCsv && (
          <Button
            className={css`
              background: var(--color-backgroundLight) !important;
              border-radius: 16px;
              cursor: pointer;
              font-size: 14px;
              padding: 4px 8px !important;
              line-height: 1;
            `}
            variant="secondary"
            onClick={() => {
              setValue('')
              setError(undefined)
              setImportedFromCsv(false)
            }}
          >
            Clear
          </Button>
        )}
      </div>
      {(invalidRows.length > 0 || error) && (
        <motion.div
          key={error ?? invalidRows.join(', ')}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p
            css={{
              color: 'var(--color-status-error)',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {error ??
              (invalidRows.length > 6
                ? 'Many lines have invalid format.'
                : `Invalid format at line ${invalidRows.join(', ')}`)}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default MultiLineSendInput
