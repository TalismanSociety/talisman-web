import Welcome from '@components/recipes/Welcome'
import { useAddReadonlyAccountForm, useSetReadonlyAccounts } from '@domains/accounts/hooks'
import { ReadonlyAccount, readOnlyAccountsState } from '@domains/accounts/recoils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { shortenAddress } from '@util/format'
import { PropsWithChildren, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export type AccountConnectionGuardProps = PropsWithChildren

const POPULAR_ACCOUNTS: ReadonlyAccount[] = [
  { name: 'Leemo', address: '5CLyeaugtNX8E24cFMRJZanhV1EZfTHwkt2MgFmcez9iuEe4' },
  { name: 'Swader', address: '5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr' },
  { name: 'Gav', address: '5F7LiCA6T4DWUDRQyFAWsRqVwxrJEznUtcw4WNnb5fe6snCH' },
]

export const useShouldShowAccountConnectionGuard = () => {
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  return !allowExtensionConnection && readonlyAccounts.length === 0
}

const AccountConnectionGuard = (props: AccountConnectionGuardProps) => {
  const setAllowExtensionConnection = useSetRecoilState(allowExtensionConnectionState)
  const shouldShowGuard = useShouldShowAccountConnectionGuard()
  const isWeb3Injected = useIsWeb3Injected()

  const { add } = useSetReadonlyAccounts()

  const {
    address: [address, setAddress],
    confirmState,
    submit,
  } = useAddReadonlyAccountForm()

  const connect = useCallback(() => setAllowExtensionConnection(true), [setAllowExtensionConnection])

  if (!shouldShowGuard) {
    return <>{props.children}</>
  }

  return (
    <div css={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center' }}>
      <Welcome
        walletButton={
          isWeb3Injected ? (
            <Welcome.WalletButton variant="connect" onClick={connect} />
          ) : (
            <Welcome.WalletButton as="a" variant="install" href="https://talisman.xyz/download" />
          )
        }
        addressInput={<Welcome.AddressInput value={address} onChange={event => setAddress(event.target.value)} />}
        addressInputConfirmButton={
          <Welcome.AddressInputConfirmButton disabled={confirmState === 'disabled'} onClick={submit} />
        }
        popularAccounts={POPULAR_ACCOUNTS.map(x => (
          <Welcome.PopularAccount
            name={x.name ?? shortenAddress(x.address)}
            address={x.address}
            onClick={() => add(x)}
          />
        ))}
        css={{ flex: 1, margin: 'auto' }}
      />
    </div>
  )
}

export default AccountConnectionGuard
