import DialogComponent from '@components/recipes/ExportTxHistoryDialog'
import { accountsState } from '@domains/accounts/recoils'
import * as Sentry from '@sentry/react'
import { toast } from '@talismn/ui'
import { stringify } from 'csv-stringify/browser/esm'
import { differenceInYears, subMonths } from 'date-fns'
import { request } from 'graphql-request'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { graphql } from '../../../generated/gql/extrinsicHistory/gql'

export type ExportTxHistoryWidgetProps = {
  children: (props: { onToggleOpen: () => unknown }) => ReactNode
}

const ExportTxHistoryWidget = (props: ExportTxHistoryWidgetProps) => {
  const [open, setOpen] = useState(false)

  const accounts = useRecoilValue(accountsState)
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])

  const [fromDate, setFromDate] = useState<Date | undefined>(subMonths(new Date(), 1))
  const [toDate, setToDate] = useState<Date | undefined>(new Date())

  const onRequestExport = useCallback(() => {
    const promise = request(
      import.meta.env.REACT_APP_EX_HISTORY_INDEXER,
      graphql(`
        query extrinsicCsv($address: String!, $timestampGte: DateTime!, $timestampLte: DateTime!) {
          extrinsicCsv(where: { addressIn: [$address], timestampGte: $timestampGte, timestampLte: $timestampLte })
        }
      `),
      {
        address: selectedAccount?.address ?? '',
        timestampGte: fromDate?.toISOString(),
        timestampLte: toDate?.toISOString(),
      }
    ).then(async x => {
      if (x.extrinsicCsv.length <= 1) {
        throw new Error('No historical results found')
      }

      await new Promise<void>((resolve, reject) =>
        stringify(x.extrinsicCsv, (error, output) => {
          if (error !== undefined) {
            reject(error)
          } else {
            const csv = 'data:text/csv;charset=utf-8,' + output
            window.open(encodeURI(csv))
            resolve()
          }
        })
      ).catch(error => {
        Sentry.captureException(error)
        throw new Error('An error has occurred while generating CSV')
      })
    })

    setOpen(false)

    void toast.promise(promise, {
      loading: 'Generating CSV',
      error: error => error.message,
      success: 'Successfully generated CSV',
    })
  }, [fromDate, selectedAccount?.address, toDate])

  const error = useMemo(() => {
    if (fromDate === undefined || toDate === undefined) {
      return 'Must specify a date range'
    }

    if (Math.abs(differenceInYears(fromDate, toDate)) > 1) {
      return "Can't export more than 1 year"
    }

    return undefined
  }, [fromDate, toDate])

  return (
    <>
      <DialogComponent
        open={open}
        onRequestDismiss={useCallback(() => setOpen(false), [])}
        accounts={accounts.map(x => ({
          ...x,
          selected: x.address === selectedAccount?.address,
          name: x.name ?? x.address,
          balance: '',
        }))}
        onSelectAccount={useCallback(
          x => setSelectedAccount(accounts.find(account => account.address === x.address)),
          [accounts, setSelectedAccount]
        )}
        fromDate={fromDate}
        onChangeFromDate={setFromDate}
        toDate={toDate}
        onChangeToDate={setToDate}
        onRequestExport={onRequestExport}
        error={error}
      />
      {props.children({ onToggleOpen: useCallback(() => setOpen(x => !x), []) })}
    </>
  )
}

export default ExportTxHistoryWidget
