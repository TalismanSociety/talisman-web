import {
  Button,
  CircularProgressIndicator,
  EyeOfSauronProgressIndicator,
  IconButton,
  Identicon,
  TextInput,
  Tooltip,
} from '@talismn/ui'
import { Layout } from '../Layout'
import { Copy, Database, Plus, Trash } from '@talismn/icons'
import { Contact, useAddressBook, useDeleteContact } from '@domains/offchain-data'
import { AddContactModal } from './AddContactModal'
import { useState, useMemo } from 'react'
import { copyToClipboard } from '@domains/common'
import { useInput } from '@hooks/useInput'
import { Multisig, useSelectedMultisig } from '@domains/multisig'
import Logomark from '../../components/Logomark'

const Header: React.FC<{ onAddContact: () => void; vaultName: string }> = ({ onAddContact, vaultName }) => (
  <div css={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <div>
      <div css={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>Address Book</h2>
        <Tooltip
          content={
            <p css={{ maxWidth: 350 }}>
              Your Address Book is currently hosted securely with Signet's Database. To find out more about Self
              Hosting, contact us at {process.env.REACT_APP_CONTACT_EMAIL}
            </p>
          }
        >
          <div css={{ position: 'relative' }}>
            <Database size={20} />
            <Logomark css={{ position: 'absolute', top: 0, right: '-60%' }} size={12} />
          </div>
        </Tooltip>
      </div>
      <p css={({ color }) => ({ color: color.primary, span: { color: color.offWhite } })}>
        Store shared contacts securely for <span>{vaultName}</span>
      </p>
    </div>
    <div css={{ display: 'flex', flex: 1, alignItems: 'flex-end', marginTop: 21 }}>
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <p css={({ color }) => ({ color: color.offWhite })}>Contacts</p>
        <p>Manage contacts to share and edit with other Multisig members</p>
      </div>
      <Button variant="outlined" css={{ borderRadius: 12, padding: '8px 12px' }} onClick={onAddContact}>
        <div css={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Plus size={16} />
          <p css={{ marginTop: 4, fontSize: 14 }}>Add Contact</p>
        </div>
      </Button>
    </div>
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
          <p css={{ fontSize: 12 }}>{contact.address.toShortSs58(multisig.chain)}</p>
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
        <div css={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 520 }}>
          <Header onAddContact={() => setIsModalOpen(true)} vaultName={selectedMultisig.name} />
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
