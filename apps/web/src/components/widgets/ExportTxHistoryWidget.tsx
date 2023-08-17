import DialogComponent from '@components/recipes/ExportTxHistoryDialog'
import { substrateAccountsState } from '@domains/accounts/recoils'
import * as Sentry from '@sentry/react'
import { toast } from '@talismn/ui'
import { stringify } from 'csv-stringify/browser/esm'
import { differenceInYears, subMonths } from 'date-fns'
import { request } from 'graphql-request'
import { useCallback, useState, type ReactNode, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { graphql } from '../../../generated/gql/extrinsicHistory/gql'

export type ExportTxHistoryWidgetProps = {
  children: (props: { onToggleOpen: () => unknown }) => ReactNode
}

const ExportTxHistoryWidget = (props: ExportTxHistoryWidgetProps) => {
  const [open, setOpen] = useState(false)

  const accounts = useRecoilValue(substrateAccountsState)
  const [selectedAccount, setSelectedAccount] = useState(accounts[0])

  const [fromDate, setFromDate] = useState(subMonths(new Date(), 1))
  const [toDate, setToDate] = useState(new Date())

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
        timestampGte: fromDate.toISOString(),
        timestampLte: toDate.toISOString(),
      }
    )
      .then(
        async x =>
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
          )
      )
      .catch(error => {
        Sentry.captureException(error)
        throw error
      })

    setOpen(false)

    void toast.promise(promise, {
      loading: 'Generating CSV',
      error: 'An error has occurred while generating CSV',
      success: 'Successfully generated CSV',
    })
  }, [fromDate, selectedAccount?.address, toDate])

  const error = useMemo(
    () => (Math.abs(differenceInYears(fromDate, toDate)) > 1 ? "Can't export more than 1 year" : undefined),
    [fromDate, toDate]
  )

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
