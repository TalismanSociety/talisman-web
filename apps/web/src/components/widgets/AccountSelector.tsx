import { Account, accountsState, substrateAccountsState } from '@domains/accounts/recoils'
import { Identicon, Select } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export type AccountSelectorProps = {
  width?: number | string
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
  defaultToFirstAddress?: boolean
  includeReadonlyAccounts?: boolean
  includeEthereumAccounts?: boolean
}

const AccountSelector = ({
  includeReadonlyAccounts = false,
  includeEthereumAccounts = false,
  ...props
}: AccountSelectorProps) => {
  const _accounts = useRecoilValue(includeEthereumAccounts ? accountsState : substrateAccountsState)
  const accounts = useMemo(
    () =>
      _accounts.filter(x => {
        if (!includeReadonlyAccounts) {
          return x.readonly !== true
        }
        return true
      }),
    [_accounts, includeReadonlyAccounts]
  )

  useEffect(
    () => {
      if (props.defaultToFirstAddress && accounts[0] !== undefined) {
        props.onChangeSelectedAccount(accounts[0])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.defaultToFirstAddress]
  )

  return (
    <Select
      width={props.width}
      value={typeof props.selectedAccount === 'string' ? props.selectedAccount : props.selectedAccount?.address}
      onChange={useCallback(
        (address: string | undefined) => props.onChangeSelectedAccount(accounts.find(x => x.address === address)),
        [accounts, props]
      )}
    >
      {accounts.map(x => (
        <Select.Item
          key={x.address}
          value={x.address}
          leadingIcon={<Identicon value={x.address} size={40} />}
          headlineText={x.name ?? shortenAddress(x.address)}
          supportingText=""
        />
      ))}
    </Select>
  )
}

export default AccountSelector
