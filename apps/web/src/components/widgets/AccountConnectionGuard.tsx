import Welcome from '@components/recipes/Welcome'
import { popularAccounts, useAddReadonlyAccountForm, useSetReadonlyAccounts } from '@domains/accounts'
import { readOnlyAccountsState } from '@domains/accounts/recoils'
import { useHadPreviouslyConnectedWallet } from '@domains/extension'
import { shortenAddress } from '@util/format'
import { type PropsWithChildren } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'

export type AccountConnectionGuardProps = PropsWithChildren

export const useShouldShowAccountConnectionGuard = () => {
  const hadPreviouslyConnectedWallet = useHadPreviouslyConnectedWallet()
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  return !hadPreviouslyConnectedWallet && readonlyAccounts.length === 0
}

const AccountConnectionGuard = (props: AccountConnectionGuardProps) => {
  const shouldShowGuard = useShouldShowAccountConnectionGuard()
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const { add } = useSetReadonlyAccounts()

  const {
    address: [address, setAddress],
    confirmState,
    submit,
  } = useAddReadonlyAccountForm()

  if (!shouldShowGuard) {
    return <>{props.children}</>
  }

  return (
    <div css={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
      <Welcome
        walletButton={<Welcome.WalletButton onClick={() => setWalletConnectionSideSheetOpen(true)} />}
        addressInput={<Welcome.AddressInput value={address} onChange={event => setAddress(event.target.value)} />}
        addressInputConfirmButton={
          <Welcome.AddressInputConfirmButton disabled={confirmState === 'disabled'} onClick={submit} />
        }
        popularAccounts={popularAccounts.map((x, index) => (
          <Welcome.PopularAccount
            key={index}
            name={x.name ?? shortenAddress(x.address)}
            address={x.address}
            description={x.description}
            onClick={() => add(x)}
          />
        ))}
        css={{ flex: 1, margin: 'auto' }}
      />
    </div>
  )
}

export default AccountConnectionGuard
