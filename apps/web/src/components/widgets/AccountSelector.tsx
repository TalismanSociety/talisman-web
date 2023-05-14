import { Account } from '@domains/accounts/recoils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { Download } from '@talismn/icons'
import { Button, Identicon, Select } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useCallback, useState, useTransition } from 'react'
import { useRecoilState } from 'recoil'

export type AccountSelectorProps = {
  width?: number | string
  accounts: Account[]
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
}

const AccountSelector = (props: AccountSelectorProps) => {
  const onChange = useCallback(
    (address: string | undefined) => props.onChangeSelectedAccount(props.accounts.find(x => x.address === address)),
    [props]
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
      {props.accounts.map(x => (
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

export const useAccountSelector = (
  accounts: Account[],
  initialAccount?: Account | number | ((accounts?: Account[]) => Account),
  accountSelectorProps?: Omit<AccountSelectorProps, 'accounts' | 'selectedAccount' | 'onChangeSelectedAccount'>
) => {
  const [isTransitioning, startTransition] = useTransition()

  const [account, setAccount] = useState(
    typeof initialAccount === 'function'
      ? initialAccount(accounts)
      : typeof initialAccount === 'number'
      ? accounts.at(initialAccount)
      : initialAccount
  )

  return [
    account,
    <AccountSelector
      {...accountSelectorProps}
      accounts={accounts}
      selectedAccount={account}
      onChangeSelectedAccount={account => startTransition(() => setAccount(account))}
    />,
    isTransitioning,
  ] as const
}

export default AccountSelector
