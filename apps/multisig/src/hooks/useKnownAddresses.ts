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
    type: 'Extension',
    extensionName: meta.name,
  }))

  const addressBookContacts = useMemo(() => {
    if (!teamId) return []

    const addresses = addressBookByTeamId[teamId ?? ''] ?? []

    return addresses.map(({ address, name }) => ({
      address,
      name,
      type: 'Contacts',
    }))
  }, [addressBookByTeamId, teamId])

  const combinedList = useMemo(() => {
    const list = extensionContacts

    addressBookContacts.forEach(contact => {
      const extensionIndex = list.findIndex(item => item.address.isEqual(contact.address))

      if (extensionIndex > -1) {
        // address is in address book, but is also user's extension account
        // we will show the address book name, but keep track of the extension name
        const extensionName = list[extensionIndex]!.extensionName
        list[extensionIndex] = contact
        list[extensionIndex]!.extensionName = extensionName
      } else {
        list.push(contact)
      }
    })

    return list.sort((a, b) => {
      // list extension accounts without address book name first
      if (a.type === 'Extension' && b.type === 'Extension') return a.name.localeCompare(b.name)
      if (a.type === 'Extension') return -1
      if (b.type === 'Extension') return 1

      // sort the rest by name
      return a.name.localeCompare(b.name)
    })
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
