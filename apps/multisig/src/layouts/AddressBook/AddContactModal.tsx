import { useMemo } from 'react'
import { Button, TextInput } from '@talismn/ui'
import Modal from '@components/Modal'
import { useInput } from '@hooks/useInput'
import { Address } from '@util/addresses'
import { useAddressBook, useCreateContact } from '../../domains/offchain-data'
import { useSelectedMultisig } from '../../domains/multisig'

type Props = {
  onClose?: () => void
  isOpen?: boolean
}

export const AddContactModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const addressInput = useInput('')
  const nameInput = useInput('')
  const { createContact, creating } = useCreateContact()
  const [selectedMultisig] = useSelectedMultisig()
  const { contactsByAddress } = useAddressBook()

  const handleClose = () => {
    if (creating) return
    nameInput.onChange('')
    addressInput.onChange('')
    onClose?.()
  }

  const parsedAddress = useMemo(() => {
    try {
      return Address.fromSs58(addressInput.value)
    } catch (e) {
      return false
    }
  }, [addressInput.value])

  const handleCreateContact = async () => {
    if (!parsedAddress) return
    const created = await createContact(parsedAddress, nameInput.value, selectedMultisig.id)
    if (created) handleClose()
  }

  const disabled = !parsedAddress || !nameInput.value
  const conflict = parsedAddress ? !!contactsByAddress[parsedAddress.toSs58()] : false

  return (
    <Modal isOpen={isOpen ?? false} width="100%" maxWidth={420} contentLabel="Add new contact">
      <h1 css={{ fontSize: 20, fontWeight: 700 }}>Add new contact</h1>
      <p css={{ marginTop: 8 }}>Saved contacts will be shared by all members of your multisig.</p>
      <form css={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <TextInput placeholder="Contact Name" leadingLabel="Name" {...nameInput} />
        <TextInput
          placeholder="Address"
          leadingLabel="Address"
          {...addressInput}
          leadingSupportingText={
            conflict ? (
              <p
                css={({ color }) => ({
                  color: color.lightGrey,
                  fontSize: 14,
                  marginLeft: 12,
                })}
              >
                Address already exists in address book.
              </p>
            ) : null
          }
        />
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            button: {
              height: 56,
              p: { marginTop: 4 },
            },
          }}
        >
          <Button type="button" variant="outlined" css={{ width: '100%' }} onClick={handleClose}>
            <p>Cancel</p>
          </Button>
          <Button
            css={{ width: '100%' }}
            disabled={disabled || creating || conflict}
            loading={creating}
            onClick={handleCreateContact}
          >
            <p>Save</p>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
