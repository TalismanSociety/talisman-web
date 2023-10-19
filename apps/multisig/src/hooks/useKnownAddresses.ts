import { useRecoilValue } from 'recoil'
import { AddressWithName } from '../components/AddressInput'
import { accountsState } from '../domains/extension'

// TODO: add addresses from address book
export const useKnownAddresses = (): AddressWithName[] => {
  const extensionAccounts = useRecoilValue(accountsState)

  return extensionAccounts.map(({ address, meta }) => ({
    address,
    name: meta.name ?? '',
    type: 'Your Extension',
  }))
}
