import { Query } from '@archetypes/Transaction/lib'
import DialogComponent from '@components/recipes/ExportTxHistoryDialog'
import { substrateAccountsState } from '@domains/accounts/recoils'
import { toast } from '@talismn/ui'
import { stringify } from 'csv-stringify/browser/esm'
import { subMonths } from 'date-fns'
import { gql, request } from 'graphql-request'
import { ReactNode, useCallback, useState } from 'react'
import { useRecoilValue } from 'recoil'

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
    const promise = request<Pick<Query, 'addressById'>>(
      process.env.REACT_APP_TX_HISTORY_INDEXER,
      gql`
        query ($address: String!, $fromDate: DateTime!, $toDate: DateTime!) {
          addressById(id: $address) {
            events(
              where: {
                event: { extrinsic: { success_eq: true }, block: { timestamp_gte: $fromDate, timestamp_lte: $toDate } }
              }
              orderBy: event_id_ASC
            ) {
              id
              event {
                name
                args
                extrinsic {
                  hash
                  fee
                  tip
                  signer
                }
                block {
                  blockNumber
                  chainId
                  timestamp
                }
              }
            }
          }
        }
      `,
      { address: selectedAccount?.address ?? '', fromDate: fromDate.toISOString(), toDate: toDate.toISOString() }
    )
      .then(x => [
        ['Date', 'Chain ID', 'Transaction Name', 'Hash', 'Block', 'Signer', 'Fee', 'Tip', 'Arguments'],
        ...(x.addressById?.events?.map(addressEvent => [
          addressEvent.event.block.timestamp,
          addressEvent.event.block.chainId,
          addressEvent.event.name,
          addressEvent.event.extrinsic?.hash,
          addressEvent.event.block.blockNumber,
          addressEvent.event.extrinsic?.signer,
          addressEvent.event.extrinsic?.fee,
          addressEvent.event.extrinsic?.tip,
          addressEvent.event.args,
        ]) ?? []),
      ])
      .then(
        x =>
          new Promise<void>((resolve, reject) =>
            stringify(x ?? [], (error, output) => {
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

    setOpen(false)

    toast.promise(promise, {
      loading: 'Generating CSV',
      error: 'An error has occurred while generating CSV',
      success: 'Successfully generated CSV',
    })
  }, [fromDate, selectedAccount?.address, toDate])

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
          x => setSelectedAccount(accounts.find(account => account.address === x.address)!),
          [accounts, setSelectedAccount]
        )}
        fromDate={fromDate}
        onChangeFromDate={setFromDate}
        toDate={toDate}
        onChangeToDate={setToDate}
        onRequestExport={onRequestExport}
      />
      {props.children({ onToggleOpen: useCallback(() => setOpen(x => !x), []) })}
    </>
  )
}

export default ExportTxHistoryWidget
