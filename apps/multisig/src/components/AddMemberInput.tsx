import toast from 'react-hot-toast'
import AddressInput, { AddressWithName } from './AddressInput'
import { Address } from '../util/addresses'
import { useState } from 'react'
import { Button } from '@talismn/ui'
import { Plus } from '@talismn/icons'

type Props = {
  onNewAddress: (a: Address) => void
  validateAddress?: (a: Address) => boolean
  addresses?: AddressWithName[]
  compactInput?: boolean
}

export const AddMemberInput: React.FC<Props> = ({ validateAddress, onNewAddress, addresses, compactInput }) => {
  const [addressInput, setAddressInput] = useState('')
  const [address, setAddress] = useState<Address | undefined>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      toast.error('Invalid SS58 address')
    } else {
      const isValid = validateAddress ? validateAddress(address) : true
      if (!isValid) return
      onNewAddress(address)
      setAddressInput('')
      setAddress(undefined)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        button: {
          height: 54,
          gap: 12,
        },
      }}
    >
      <AddressInput
        addresses={addresses}
        value={addressInput}
        compact={compactInput}
        onChange={(address, input) => {
          setAddressInput(input)
          setAddress(address)
        }}
      />
      <Button disabled={!address} variant="outlined" leadingIcon={<Plus size={24} />} type="submit">
        <p css={{ marginTop: 4, marginLeft: 8 }}>Add</p>
      </Button>
    </form>
  )
}
