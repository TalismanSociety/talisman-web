import toast from 'react-hot-toast'
import AddressInput, { AddressWithName } from './AddressInput'
import { Address } from '../util/addresses'
import { useState } from 'react'
import { css } from '@emotion/css'
import { IconButton } from '@talismn/ui'
import { useTheme } from '@emotion/react'
import { Plus } from '@talismn/icons'

type Props = {
  onNewAddress: (a: Address) => void
  validateAddress?: (a: Address) => boolean
  addresses?: AddressWithName[]
}

export const AddMemberInput: React.FC<Props> = ({ validateAddress, onNewAddress, addresses }) => {
  const theme = useTheme()
  const [addressInput, setAddressInput] = useState('')
  const [address, setAddress] = useState<Address | undefined>()

  return (
    <div css={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 24, width: '100%' }}>
      <AddressInput
        addresses={addresses}
        value={addressInput}
        onChange={(address, input) => {
          setAddressInput(input)
          setAddress(address)
        }}
      />
      <div
        onClick={() => {
          if (!address) {
            toast.error('Invalid SS58 address')
          } else {
            const isValid = validateAddress ? validateAddress(address) : true
            if (!isValid) return
            onNewAddress(address)
            setAddressInput('')
            setAddress(undefined)
          }
        }}
        className={css`
          background: var(--color-backgroundLight) !important;
          color: var(--color-offWhite) !important;
          border-radius: 24px !important;
          width: 176px;
          justify-self: center;
          height: 40px;
          padding: 0 !important;
          cursor: pointer;
        `}
      >
        <div
          css={{
            display: 'flex',
            gap: 8,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'backdrop-filter 0.1s ease-in-out',
            ...(address
              ? {
                  'cursor': 'pointer',
                  ':hover': { backdropFilter: 'brightness(1.15)' },
                }
              : { opacity: 0.5 }),
          }}
        >
          <IconButton as="button" size="24px" contentColor={`rgb(${theme.primary})`}>
            <Plus size={24} />
          </IconButton>
          <span>Add member</span>
        </div>
      </div>
    </div>
  )
}
