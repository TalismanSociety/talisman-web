import { accountsState, substrateAccountsState } from '@domains/accounts/recoils'
import { Identicon, Select } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export type AccountSelectorProps = {
  selectedAddress?: string
  onChangeSelectedAddress: (value: string | undefined) => unknown
  defaultToFirstAddress?: boolean
  includeReadonlyAccounts?: boolean
  includeEthereumAccounts?: boolean
}

const AccountSelector = ({
  includeReadonlyAccounts = true,
  includeEthereumAccounts,
  ...props
}: AccountSelectorProps) => {
  const accounts = useRecoilValue(includeEthereumAccounts ? accountsState : substrateAccountsState)

  useEffect(
    () => {
      if (props.defaultToFirstAddress && accounts[0] !== undefined) {
        props.onChangeSelectedAddress(accounts[0].address)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.defaultToFirstAddress]
  )

  return (
    <Select value={props.selectedAddress} onChange={props.onChangeSelectedAddress}>
      {accounts
        .filter(x => {
          if (!includeReadonlyAccounts) {
            return x.readonly !== true
          }
          return true
        })
        .map(x => (
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
