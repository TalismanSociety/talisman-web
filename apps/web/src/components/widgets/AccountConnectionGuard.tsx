import Welcome from '@components/recipes/Welcome'
import { useAddReadonlyAccountForm, useSetReadonlyAccounts } from '@domains/accounts/hooks'
import { type ReadonlyAccount, readOnlyAccountsState } from '@domains/accounts/recoils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { shortenAddress } from '@util/format'
import { type PropsWithChildren, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

export type AccountConnectionGuardProps = PropsWithChildren

const POPULAR_ACCOUNTS: Array<ReadonlyAccount & { description?: string }> = [
  { name: 'Swader', address: '5CK8D1sKNwF473wbuBP6NuhQfPaWUetNsWUNAAzVwTfxqjfr', description: '200+ NFTs' },
  { name: '🍺 Gav', address: '5F7LiCA6T4DWUDRQyFAWsRqVwxrJEznUtcw4WNnb5fe6snCH', description: 'Polkadot founder' },
  { name: 'Jay', address: '5DfAiCavECjh37Bdgy7q5ib7AtjJmvZDmSkVBoBXPjVWXCST', description: '$1M+ assets' },
  { name: 'Bill Laboon', address: '5HjZCeVcUVpThHNMyMBMKqN5ajph9CkDmZhn9BK48TmC3K4Y', description: '50+ Crowdloans' },
  { name: 'Vitalik.eth', address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', description: 'Vitalik Buterin' },
  { address: '0x804c4c527f3b278a1b328ebe239359e1c1008398', description: '$13M+ EVM assets' },
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
        popularAccounts={POPULAR_ACCOUNTS.map((x, index) => (
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
