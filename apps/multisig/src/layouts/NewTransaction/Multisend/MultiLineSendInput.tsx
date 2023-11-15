import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { motion } from 'framer-motion'
import { createTheme } from '@uiw/codemirror-themes'
import { tags } from '@lezer/highlight'
import { css } from '@emotion/css'
import { Address, shortenAddress } from '@util/addresses'
import { formatUnits, parseUnits } from '@util/numbers'
import { BaseToken, tokenPriceState } from '@domains/chains'
import { useOnClickOutside } from '@domains/common/useOnClickOutside'
import { MultiSendSend } from './multisend.types'
import { useRecoilValueLoadable } from 'recoil'
import AmountUnitSelector, { AmountUnit } from '@components/AmountUnitSelector'
import FileUploadButton from '@components/FileUploadButton'
import BN from 'bn.js'
import { Button, Tooltip } from '@talismn/ui'
import { Info, ToggleLeft, ToggleRight } from '@talismn/icons'

type Props = {
  label?: string
  token?: BaseToken
  onChange: (rows: MultiSendSend[], invalidRows: number[]) => void
}

const theme = createTheme({
  theme: 'dark',
  settings: {
    background: 'var(--color-grey800)',
    foreground: 'var(--color-grey800)',
    selection: 'var(--color-backgroundLighter)',
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
): { data?: { address: Address; addressString: string; amount: string; amountBn: BN }; error?: string } => {
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

  // try format "address=amount", common for imported CSV
  if (!address || !amount) {
    ;[address, amount] = row.split('=')
  }

  if (!address || !amount) return { error: 'Invalid Row' }

  const trimmedAddress = address.trim()
  const trimmedAmount = amount.trim()

  const parsedAddress = Address.fromSs58(trimmedAddress)
  const invalidAmount = trimmedAmount === '' || isNaN(+trimmedAmount)
  if (!parsedAddress && invalidAmount) return { error: 'Invalid Row' }
  if (!parsedAddress) return { error: 'Invalid Address' }
  if (invalidAmount) return { error: 'Invalid Amount' }

  return {
    data: {
      address: parsedAddress,
      addressString: trimmedAddress,
      amount: trimmedAmount,
      amountBn: parseAmount(trimmedAmount),
    },
  }
}

const exampleAddress = Address.fromSs58('5DFMVCaWNPcSdPVmK7d6g81ZV58vw5jkKbQk8vR4FSxyhJBD') as Address

export const MultiLineSendInput: React.FC<Props> = ({
  label = 'Enter one address and amount on each line.',
  onChange,
  token,
}) => {
  const [amountUnit, setAmountUnit] = useState<AmountUnit>(AmountUnit.Token)
  const [editing, setEditing] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(true)
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
    // when not in review mode, user wants to see the full original input
    if (!isReviewMode) return value
    return formattedRows
      .map(({ validRow: { data, error }, input }) => {
        // for invalid rows, we allow empty line for grouping, otherwise we warn user of invalid row
        if (error || !data) return input === '' ? '' : `${error ?? 'Invalid Row'}: ${input}`
        const addressToFormat = token ? data.address.toSs58(token.chain) : data.addressString
        let formattedString = shortenAddress(addressToFormat, 'short')

        if (!token) return `${formattedString}, ${data.amount}`

        // display the right token / usd amount
        const tokenAmount = (+formatUnits(data.amountBn, token.decimals)).toFixed(4)
        const tokenFullString = `${tokenAmount} ${token.symbol}`
        if (amountUnit === AmountUnit.Token) {
          formattedString += `, ${tokenFullString}`
        } else {
          formattedString += `, ${data.amount} USD (${tokenFullString})`
        }

        return formattedString
      })
      .join('\n')
  }, [isReviewMode, value, formattedRows, token, amountUnit])

  const invalidRows = useMemo(() => {
    const indexes: number[] = []
    formattedRows.forEach(({ validRow: { data, error }, input }, i) => {
      if ((!data || error) && input !== '') indexes.push(i + 1)
    })
    return indexes
  }, [formattedRows])

  const validRows = useMemo(() => {
    if (!token) return undefined
    return formattedRows
      .filter(r => !!r.validRow.data)
      .map(
        ({ validRow: { data } }) =>
          ({
            address: data!.address,
            amountBn: data!.amountBn,
            token,
          }!)
      )
  }, [token, formattedRows])

  const handleCsvUpload = async (files: File[]) => {
    const [file] = files
    if (!file || !token) return
    setError(undefined)
    const textValue = await file.text()
    const rows = textValue.split('\n')
    const values: string[] = []

    rows.forEach(row => {
      const rowValues = row.split(',')
      const [addressCol, amountCol] = rowValues

      // skip rows that don't have address or amount
      const { data } = findAddressAndAmount(`${addressCol}, ${amountCol}`, parseAmount)
      values.push(`${data?.addressString ?? addressCol}, ${data?.amount ?? amountCol}`)
    })

    if (values.length === 0) setError('The uploaded CSV file does not have a valid row.')
    setImportedFromCsv(values.length > 0)
    setValue(values.join('\n'))
    setIsReviewMode(false)
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
        <div>
          <p>{label}</p>
          {token && (
            <p css={{ fontSize: 12, opacity: 0.8 }}>e.g. {shortenAddress(exampleAddress.toSs58(token.chain))}, 55.56</p>
          )}
        </div>
        <div css={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tooltip
            content={
              <div css={{ fontSize: 14, padding: 8, p: { fontSize: 14 } }}>
                <p>Format of CSV file:</p>
                <ul css={{ margin: 4, paddingLeft: 4 }}>
                  <li>First column should be address of recipients.</li>
                  <li>Second column should be amounts for each recipient.</li>
                </ul>
                <br />
                <p>You can also just copy / paste the table.</p>
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
          position: relative;
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
        {/** Provide hint on why they cant change the input if they're importing from CSV */}
        {importedFromCsv && editing && (
          <Tooltip
            placement="top"
            content="To prevent accidental changes, please update the CSV file to modify imported data."
          >
            <div
              css={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          </Tooltip>
        )}
        <CodeMirror
          ref={codeMirrorRef}
          onChange={val => {
            if (isReviewMode) return
            setError(undefined)
            setValue(val)
          }}
          onClick={() => {
            setIsReviewMode(false)
            setEditing(true)
          }}
          editable={!importedFromCsv && !isReviewMode}
          placeholder={`14JVAW...Vkbg5, 10.23456\n14JVAW...Vkbg5 0.23456\n14JVAW...Vkbg5=2.23456`}
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
        <AmountUnitSelector
          tokenPrices={tokenPrices}
          value={amountUnit}
          onChange={unit => {
            setIsReviewMode(true)
            setAmountUnit(unit)
          }}
        />
        <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          {value.length > 0 && (
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                svg: { color: isReviewMode ? 'var(--color-primary)' : undefined },
                p: { fontSize: 12, marginTop: 4, lineHeight: 1 },
                cursor: 'pointer',
              }}
              onClick={() => setIsReviewMode(!isReviewMode)}
            >
              {isReviewMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
              <p>
                Review
                <br />
                Mode
              </p>
            </div>
          )}
        </div>
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
