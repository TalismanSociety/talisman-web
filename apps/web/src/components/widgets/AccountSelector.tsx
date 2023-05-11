import { Account, accountsState, substrateAccountsState } from '@domains/accounts/recoils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { Download } from '@talismn/icons'
import { Button, Identicon, Select } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useCallback, useEffect, useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

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
    [props.defaultToFirstAddress, accounts.length === 0]
  )

  const onChange = useCallback(
    (address: string | undefined) => props.onChangeSelectedAccount(accounts.find(x => x.address === address)),
    [accounts, props]
  )

  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)

  if (!useIsWeb3Injected()) {
    return (
      <Button as="a" href="https://talisman.xyz/download" target="_blank" trailingIcon={<Download />}>
        Install wallet
      </Button>
    )
  }

  if (!allowExtensionConnection) {
    return <Button onClick={() => setAllowExtensionConnection(true)}>Connect wallet</Button>
  }

  return (
    <Select
      width={props.width}
      value={typeof props.selectedAccount === 'string' ? props.selectedAccount : props.selectedAccount?.address}
      onChange={onChange}
    >
      {accounts.map(x => (
        <Select.Option
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
