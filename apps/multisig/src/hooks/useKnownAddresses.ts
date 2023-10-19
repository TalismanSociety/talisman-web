import { useRecoilValue } from 'recoil'
import { AddressWithName } from '../components/AddressInput'
import { accountsState } from '../domains/extension'
import { addressBookByTeamIdState } from '../domains/offchain-data'
import { useMemo } from 'react'

export const useKnownAddresses = (
  teamId?: string
): { addresses: AddressWithName[]; contactByAddress: Record<string, AddressWithName> } => {
  const extensionAccounts = useRecoilValue(accountsState)
  const addressBookByTeamId = useRecoilValue(addressBookByTeamIdState)

  const extensionContacts: AddressWithName[] = extensionAccounts.map(({ address, meta }) => ({
    address,
    name: meta.name ?? '',
    type: 'You',
    extensionName: meta.name,
  }))

  const addressBookContacts = useMemo(() => {
    if (!teamId) return []

    const addresses = addressBookByTeamId[teamId ?? ''] ?? []

    return addresses.map(({ address, name }) => ({
      address,
      name,
      type: 'Added',
    }))
  }, [addressBookByTeamId, teamId])

  const combinedList = useMemo(() => {
    const list = extensionContacts

    addressBookContacts.forEach(contact => {
      const extensionIndex = list.findIndex(item => item.address.isEqual(contact.address))
      if (extensionIndex > -1) {
        list[extensionIndex]!.addressBookName = contact.name
      } else {
        list.push(contact)
      }
    })

    return list
  }, [addressBookContacts, extensionContacts])

  const contactByAddress = useMemo(() => {
    return combinedList.reduce((acc, contact) => {
      const addressString = contact.address.toSs58()
      if (!acc[addressString]) acc[addressString] = contact
      return acc
    }, {} as Record<string, AddressWithName>)
  }, [combinedList])

  return { addresses: combinedList, contactByAddress }
}
