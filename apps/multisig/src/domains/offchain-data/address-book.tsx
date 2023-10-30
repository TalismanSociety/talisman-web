import { useCallback, useEffect, useState } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedAccountState } from '../auth'
import { DUMMY_MULTISIG_ID, useSelectedMultisig } from '../multisig'
import { gql } from 'graphql-request'
import { requestSignetBackend } from './hasura'
import { Address } from '@util/addresses'
import toast from 'react-hot-toast'
import { isEqual } from 'lodash'

const ADDRESSES_QUERY = gql`
  query Addresses($teamId: uuid!) {
    address(where: { team_id: { _eq: $teamId } }, order_by: { name: asc }, limit: 300) {
      id
      name
      address
      team_id
    }
  }
`

export type Contact = {
  id: string
  name: string
  address: Address
  teamId: string
}

export const addressBookLoadingState = atom<boolean>({
  key: 'addressBookLoadingState',
  default: false,
})

export const addressBookByTeamIdState = atom<Record<string, Contact[]>>({
  key: 'addressBookByTeamIdState',
  default: {},
})

// allow efficient lookup of contacts by address
export const addressBookByTeamIdMapState = selector({
  key: 'addressBookByTeamIdMap',
  get: ({ get }) => {
    const addressBookByTeamId = get(addressBookByTeamIdState)

    const map = {} as Record<string, Record<string, Contact>>

    Object.entries(addressBookByTeamId).forEach(([teamId, contacts]) => {
      map[teamId] = {}
      contacts.forEach(contact => {
        map[teamId]![contact.address.toSs58()] = contact
      })
    })
    return map
  },
})

export const useAddressBook = () => {
  const loading = useRecoilValue(addressBookLoadingState)
  const addressBookByTeamId = useRecoilValue(addressBookByTeamIdState)
  const addressBookByTeamIdMap = useRecoilValue(addressBookByTeamIdMapState)
  const [selectedMultisig] = useSelectedMultisig()

  if (selectedMultisig.id === DUMMY_MULTISIG_ID) return { contacts: [], contactsByAddress: {}, loading: false }

  return {
    contacts: addressBookByTeamId[selectedMultisig.id],
    contactsByAddress: addressBookByTeamIdMap[selectedMultisig.id] ?? {},
    loading,
  }
}

export const useCreateContact = () => {
  const [creating, setCreating] = useState(false)
  const selectedAccount = useRecoilValue(selectedAccountState)
  const [addressBookByTeamId, setAddressBookByTeamId] = useRecoilState(addressBookByTeamIdState)

  const createContact = useCallback(
    async (address: Address, name: string, teamId: string) => {
      if (!selectedAccount) return
      try {
        setCreating(true)
        const { data, error } = await requestSignetBackend(
          gql`
            mutation CreateAddress($address: String!, $name: String!, $teamId: uuid!) {
              insert_address_one(
                object: { address: $address, name: $name, team_id: $teamId }
                on_conflict: { constraint: address_address_team_id_key, update_columns: [address, team_id] }
              ) {
                id
              }
            }
          `,
          {
            address: address.toSs58(),
            name,
            teamId,
          },
          selectedAccount
        )

        const id = data?.insert_address_one?.id
        if (!id || error) {
          toast.error('Failed to create contact, please try again.')
          return
        }
        let addresses = addressBookByTeamId[teamId] ?? []
        const conflict = addresses.find(contact => contact.address.isEqual(address))
        toast.success(`Contact created for ${name}`)

        // dont need to update cache if there's a conflict since no update will be made in backend
        if (!conflict) {
          addresses = [...addresses, { id, name, teamId, address }]
          setAddressBookByTeamId({ ...addressBookByTeamId, [teamId]: addresses })
        }
        // inform caller that contact was created
        return true
      } catch (e) {
        console.error(e)
      } finally {
        setCreating(false)
      }
    },
    [addressBookByTeamId, selectedAccount, setAddressBookByTeamId]
  )

  return { createContact, creating }
}

export const useDeleteContact = () => {
  const [deleting, setDeleting] = useState(false)
  const selectedAccount = useRecoilValue(selectedAccountState)
  const [addressBookByTeamId, setAddressBookByTeamId] = useRecoilState(addressBookByTeamIdState)

  const deleteContact = useCallback(
    async (id: string) => {
      if (!selectedAccount) return
      try {
        setDeleting(true)
        const { data, error } = await requestSignetBackend(
          gql`
            mutation DeleteAddress($id: uuid!) {
              delete_address_by_pk(id: $id) {
                id
                team_id
              }
            }
          `,
          { id },
          selectedAccount
        )

        const deletedId = data?.delete_address_by_pk?.id
        const teamId = data?.delete_address_by_pk?.team_id
        if (!deletedId || !teamId || error) {
          toast.error('Failed to delete contact, please try again.')
          return
        }
        toast.success(`Contact deleted!`)

        let addresses = addressBookByTeamId[teamId] ?? []
        const stillInList = addresses.find(contact => contact.id === id)

        if (stillInList) {
          addresses = addresses.filter(contact => contact.id !== id)
          setAddressBookByTeamId({ ...addressBookByTeamId, [teamId]: addresses })
        }

        // inform caller that contact was deleted
        return true
      } catch (e) {
        console.error(e)
      } finally {
        setDeleting(false)
      }
    },
    [addressBookByTeamId, selectedAccount, setAddressBookByTeamId]
  )

  return { deleteContact, deleting }
}

export const AddressBookWatcher = () => {
  const selectedAccount = useRecoilValue(selectedAccountState)
  const [selectedMultisig] = useSelectedMultisig()
  const setLoading = useSetRecoilState(addressBookLoadingState)
  const [addressBookByTeamId, setAddressBookByTeamId] = useRecoilState(addressBookByTeamIdState)

  const fetchAddressBook = useCallback(async () => {
    if (!selectedAccount || selectedMultisig.id === DUMMY_MULTISIG_ID) return

    try {
      setLoading(true)
      const { data } = await requestSignetBackend<{
        address: { address: string; id: string; team_id: string; name: string }[]
      }>(ADDRESSES_QUERY, { teamId: selectedMultisig.id }, selectedAccount)

      if (data?.address) {
        const newAddressBookByTeamId = { ...addressBookByTeamId }
        if (!newAddressBookByTeamId[selectedMultisig.id]) newAddressBookByTeamId[selectedMultisig.id] = []

        data.address.forEach(({ id, name, address, team_id }) => {
          try {
            const parsedAddress = Address.fromSs58(address)
            if (parsedAddress) {
              let addressesOfTeam = newAddressBookByTeamId[team_id] ?? []
              const conflict = addressesOfTeam.find(contact => contact.address.isEqual(parsedAddress))
              if (!conflict) {
                addressesOfTeam = [...addressesOfTeam, { id, name, teamId: team_id, address: parsedAddress }]
                newAddressBookByTeamId[team_id] = addressesOfTeam
              }
            }
          } catch (e) {
            console.error('Failed to parse contact:')
            console.error(e)
          }
        })

        if (isEqual(addressBookByTeamId, newAddressBookByTeamId)) return
        setAddressBookByTeamId(newAddressBookByTeamId)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [addressBookByTeamId, selectedAccount, selectedMultisig.id, setAddressBookByTeamId, setLoading])

  useEffect(() => {
    if (!selectedAccount) return
    // fetch address book for the first time
    fetchAddressBook()

    // refresh every 15secs to update address books in "real-time"
    const interval = setInterval(() => {
      fetchAddressBook()
    }, 15_000)

    return () => clearInterval(interval)
  }, [fetchAddressBook, selectedAccount])

  return null
}
