import ExportHistoryAlertDialog from '../../recipes/ExportHistoryAlertDialog'
import type { Account } from '../../../domains/accounts'
import * as Sentry from '@sentry/react'
import { Button, FloatingActionButtonPortal, toast } from '@talismn/ui'
import { encodeAnyAddress } from '@talismn/util'
import { stringify as stringifyCsv } from 'csv-stringify/browser/esm'
import { useMemo, useState } from 'react'
import { getExtrinsicBalanceChangeAmount, getExtrinsicTotalAmount, type ExtrinsicNode } from './utils'

type HistoryExportFloatingActionButtonProps = {
  accounts: Account[]
  extrinsics: ExtrinsicNode[]
}

const HistoryExportFloatingActionButton = (props: HistoryExportFloatingActionButtonProps) => {
  const [open, setOpen] = useState(false)

  const encodedAddresses = useMemo(() => props.accounts?.map(x => encodeAnyAddress(x.address)) ?? [], [props.accounts])

  if (props.extrinsics.length === 0) {
    return null
  }

  return (
    <>
      <FloatingActionButtonPortal>
        <Button
          css={theme => ({ background: theme.color.background })}
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          Export {props.extrinsics.length} records
        </Button>
      </FloatingActionButtonPortal>
      {open && (
        <ExportHistoryAlertDialog
          onRequestDismiss={() => setOpen(false)}
          onConfirm={() => {
            const records = [
              [
                'type',
                'timestamp',
                'chain',
                'module',
                'call',
                'hash',
                'amount',
                'changeInBalance',
                'symbol',
                'subscanUrl',
              ],
              ...props.extrinsics.map(extrinsic => {
                const selfSigned = !extrinsic.signer
                  ? false
                  : encodedAddresses.includes(encodeAnyAddress(extrinsic.signer))

                const totalAmountOfInterest = getExtrinsicTotalAmount(extrinsic, props.accounts)
                const balanceChangeAmount = getExtrinsicBalanceChangeAmount(extrinsic, props.accounts)
                const [module, call] = extrinsic.call.name.split('.')

                return [
                  selfSigned ? 'outgoing' : 'incoming',
                  extrinsic.block.timestamp,
                  extrinsic.chain.name,
                  module,
                  call,
                  extrinsic.hash,
                  totalAmountOfInterest.toString(),
                  balanceChangeAmount.toString(),
                  extrinsic.transfers.edges.at(0)?.node.amount.symbol ??
                    extrinsic.rewards.edges.at(0)?.node.amount.symbol,
                  extrinsic.subscanLink?.url,
                ]
              }),
            ]

            const promise = new Promise<void>((resolve, reject) =>
              stringifyCsv(records, (error, output) => {
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

            void toast.promise(promise, {
              loading: 'Generating CSV',
              error: error => error.message,
              success: 'Successfully generated CSV',
            })

            setOpen(false)
          }}
          recordCount={props.extrinsics.length}
        />
      )}
    </>
  )
}

export default HistoryExportFloatingActionButton
