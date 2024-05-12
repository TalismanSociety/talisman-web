import Welcome from '../recipes/Welcome'
import { lookupAccountAddressState, popularAccounts } from '../../domains/accounts'
import { readOnlyAccountsState } from '../../domains/accounts/recoils'
import { useHasActiveWalletConnection } from '../../domains/extension'
import { shortenAddress } from '../../util/format'
import { useState, type PropsWithChildren } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'

export type AccountConnectionGuardProps = PropsWithChildren

export const useShouldShowAccountConnectionGuard = () => {
  const hasActiveWalletConnection = useHasActiveWalletConnection()
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)
  const lookupAccount = useRecoilValue(lookupAccountAddressState)

  return !hasActiveWalletConnection && readonlyAccounts.length === 0 && lookupAccount === undefined
}

const AccountConnectionGuard = (props: AccountConnectionGuardProps) => {
  const shouldShowGuard = useShouldShowAccountConnectionGuard()
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const [addressInput, setAddressInput] = useState('')
  const setLookupAddress = useSetRecoilState(lookupAccountAddressState)

  if (!shouldShowGuard) {
    return <>{props.children}</>
  }

  return (
    <div css={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
      <Welcome
        walletButton={<Welcome.WalletButton onClick={() => setWalletConnectionSideSheetOpen(true)} />}
        addressInput={<Welcome.AddressInput value={addressInput} onChangeText={setAddressInput} />}
        addressInputConfirmButton={<Welcome.AddressInputConfirmButton onClick={() => setLookupAddress(addressInput)} />}
        popularAccounts={popularAccounts.map((x, index) => (
          <Welcome.PopularAccount
            key={index}
            name={x.name ?? shortenAddress(x.address)}
            address={x.address}
            description={x.description}
            onClick={() => setLookupAddress(x.address)}
          />
        ))}
        css={{ flex: 1, margin: 'auto' }}
      />
    </div>
  )
}

export default AccountConnectionGuard
