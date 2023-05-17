import { AlertDialog, type AlertDialogProps, Button, DateInput, Identicon, Select, Text } from '@talismn/ui'
import { Maybe } from '@util/monads'

type Account = { selected?: boolean; name: string; address: string; balance: string }

export type ExportTxHistoryDialogProps = Pick<AlertDialogProps, 'open' | 'onRequestDismiss'> & {
  accounts: Account[]
  onSelectAccount: (account: Account) => unknown
  fromDate: Date
  onChangeFromDate: (date: Date) => unknown
  toDate: Date
  onChangeToDate: (date: Date) => unknown
  onRequestExport: () => unknown
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
}: ExportTxHistoryDialogProps) => (
  <AlertDialog
    {...props}
    title="Export CSV"
    confirmButton={<Button onClick={onRequestExport}>Export</Button>}
    content={
      <div>
        <Text.Body as="p" css={{ marginBottom: '2.4rem' }}>
          Export your Transaction History
        </Text.Body>
        <div css={{ marginBottom: '1.6rem' }}>
          <Select
            width="100%"
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
                leadingIcon={<Identicon value={account.address} size={40} />}
                headlineText={account.name}
                supportingText={account.balance}
              />
            ))}
          </Select>
        </div>
        <div css={{ display: 'flex', gap: '0.8rem' }}>
          <DateInput
            leadingLabel="Start date"
            value={fromDate.toISOString().split('T')[0]}
            onChange={x => onChangeFromDate(new Date(x.target.value))}
          />
          <DateInput
            leadingLabel="End date"
            value={toDate.toISOString().split('T')[0]}
            onChange={x => onChangeToDate(new Date(x.target.value))}
          />
        </div>
      </div>
    }
  />
)

export default ExportTxHistoryDialog
