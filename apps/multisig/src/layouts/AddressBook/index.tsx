import {
  Button,
  CircularProgressIndicator,
  EyeOfSauronProgressIndicator,
  IconButton,
  Identicon,
  TextInput,
} from '@talismn/ui'
import { Layout } from '../Layout'
import { Copy, Plus, Trash } from '@talismn/icons'
import { Contact, useAddressBook, useDeleteContact } from '@domains/offchain-data'
import { AddContactModal } from './AddContactModal'
import { useState, useMemo } from 'react'
import truncateMiddle from 'truncate-middle'
import { copyToClipboard } from '@domains/common'
import { useInput } from '@hooks/useInput'
import { Multisig, useSelectedMultisig } from '@domains/multisig'

const Header: React.FC<{ onAddContact: () => void }> = ({ onAddContact }) => (
  <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
    <h2 css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>Address Book</h2>
    <Button variant="outlined" css={{ borderRadius: 12, padding: '8px 12px' }} onClick={onAddContact}>
      <div css={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Plus size={16} />
        <p css={{ marginTop: 4, fontSize: 14 }}>Add Contact</p>
      </div>
    </Button>
  </div>
)

const ContactRow: React.FC<{ contact: Contact; multisig: Multisig }> = ({ contact, multisig }) => {
  const address = contact.address.toSs58(multisig.chain)
  const { deleteContact, deleting } = useDeleteContact()
  return (
    <div
      key={contact.id}
      css={({ color }) => ({
        borderRadius: 16,
        display: 'flex',
        padding: 16,
        backgroundColor: color.surface,
        justifyContent: 'space-between',
      })}
    >
      <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Identicon value={address} size={32} />
        <div>
          <p css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>{contact.name}</p>
          <p css={{ fontSize: 12 }}>{truncateMiddle(address, 5, 5, '...')}</p>
        </div>
      </div>
      <div
        css={({ color }) => ({
          display: 'flex',
          alignItems: 'center',
          button: { color: color.lightGrey },
        })}
      >
        <IconButton onClick={() => copyToClipboard(address, 'Address copied!')}>
          <Copy size={16} />
        </IconButton>
        <IconButton onClick={() => deleteContact(contact.id)} disabled={deleting}>
          {deleting ? <CircularProgressIndicator size={16} /> : <Trash size={16} />}
        </IconButton>
      </div>
    </div>
  )
}

export const AddressBook: React.FC = () => {
  const { contacts } = useAddressBook()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMultisig] = useSelectedMultisig()
  const queryInput = useInput('')

  const filteredContacts = useMemo(
    () =>
      contacts?.filter(contact => {
        if (contact.name.toLowerCase().includes(queryInput.value.toLowerCase())) return true
        const genericAddress = contact.address.toSs58()
        const chainAddress = contact.address.toSs58(selectedMultisig.chain)
        return (
          genericAddress.toLowerCase().includes(queryInput.value.toLowerCase()) ||
          chainAddress.toLowerCase().includes(queryInput.value.toLowerCase())
        )
      }) ?? [],
    [contacts, queryInput.value, selectedMultisig.chain]
  )

  return (
    <Layout selected="Address Book" requiresMultisig>
      <div css={{ display: 'flex', flex: 1, padding: '32px 8%' }}>
        <div css={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%', maxWidth: 520 }}>
          <Header onAddContact={() => setIsModalOpen(true)} />
          {contacts === undefined ? (
            <EyeOfSauronProgressIndicator />
          ) : contacts.length === 0 ? (
            <div css={({ color }) => ({ backgroundColor: color.surface, borderRadius: 12, padding: '32px 16px' })}>
              <p css={{ textAlign: 'center' }}>You have no saved contacts yet</p>
            </div>
          ) : (
            <div>
              <TextInput placeholder="Search by name or address..." {...queryInput} />
              <div
                css={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 24,
                  flexDirection: 'column',
                }}
              >
                {filteredContacts.map(contact => (
                  <ContactRow key={contact.id} contact={contact} multisig={selectedMultisig} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  )
}
