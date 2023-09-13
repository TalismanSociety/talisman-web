import AccountIcon from '@components/molecules/AccountIcon'
import { AlertDialog, Button, DateInput, Select, Text, type AlertDialogProps } from '@talismn/ui'
import { Maybe } from '@util/monads'
import { endOfDay, startOfDay } from 'date-fns'
import { useMemo } from 'react'

type Account = { selected?: boolean; name: string; address: string; balance: string }

export type ExportTxHistoryDialogProps = Pick<AlertDialogProps, 'open' | 'onRequestDismiss'> & {
  accounts: Account[]
  onSelectAccount: (account: Account) => unknown
  fromDate?: Date
  onChangeFromDate: (date: Date | undefined) => unknown
  toDate?: Date
  onChangeToDate: (date: Date | undefined) => unknown
  onRequestExport: () => unknown
  error?: string
}

const ExportTxHistoryDialog = ({
  accounts,
  onSelectAccount,
  fromDate,
  onChangeFromDate,
  toDate,
  onChangeToDate,
  onRequestExport,
  ...props
}: ExportTxHistoryDialogProps) => {
  const today = useMemo(() => new Date(), [])
  return (
    <AlertDialog
      {...props}
      title="Export CSV"
      confirmButton={
        <Button onClick={onRequestExport} disabled={props.error !== undefined}>
          Export
        </Button>
      }
      content={
        <div>
          <Text.Body as="p" css={{ marginBottom: '2.4rem' }}>
            Export your Transaction History
          </Text.Body>
          <div css={{ marginBottom: '1.6rem' }}>
            <Select
              css={{ width: '100%' }}
              placeholder="Select account"
              value={accounts.findIndex(x => x.selected)}
              onChange={value =>
                Maybe.of(value)
                  .map(x => accounts[Number(x)])
                  .map(onSelectAccount)
              }
            >
              {accounts.map((account, index) => (
                <Select.Option
                  key={index}
                  value={index}
                  leadingIcon={<AccountIcon account={account} size={40} />}
                  headlineText={account.name}
                  supportingText={account.balance}
                />
              ))}
            </Select>
          </div>
          <div css={{ 'display': 'flex', 'gap': '0.8rem', '> *': { flex: 1 } }}>
            <Text.Body as="div" css={{ fontSize: '1.12rem' }}>
              <div css={{ marginBottom: '0.8rem' }}>Start date</div>
              <DateInput
                value={fromDate}
                max={toDate ?? today}
                onChangeDate={x => onChangeFromDate(Maybe.of(x).mapOrUndefined(startOfDay))}
                css={{ width: '100%' }}
              />
            </Text.Body>
            <Text.Body as="div" css={{ fontSize: '1.12rem' }}>
              <div css={{ marginBottom: '0.8rem' }}>End date</div>
              <DateInput
                value={toDate}
                max={today}
                onChangeDate={x => onChangeToDate(Maybe.of(x).mapOrUndefined(endOfDay))}
                css={{ width: '100%' }}
              />
            </Text.Body>
          </div>
          {props.error !== undefined && (
            <Text.BodySmall color={theme => theme.color.error}>{props.error}</Text.BodySmall>
          )}
        </div>
      }
    />
  )
}

export default ExportTxHistoryDialog
