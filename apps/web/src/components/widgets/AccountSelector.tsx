import Identicon from '@components/atoms/Identicon'
import Select from '@components/molecules/Select'
import { selectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export type AccountSelectorProps = {
  selectedAddress?: string
  onChangeSelectedAddress: (value: string | undefined) => unknown
  defaultToFirstAddress?: boolean
}

const AccountSelector = (props: AccountSelectorProps) => {
  const accounts = useRecoilValue(selectedSubstrateAccountsState)

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
      {accounts.map(x => (
        <Select.Item
          key={x.address}
          value={x.address}
          leadingIcon={<Identicon value={x.address} size={40} />}
          headlineText={x.name}
          supportingText=""
        />
      ))}
    </Select>
  )
}

export default AccountSelector
