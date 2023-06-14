import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { Plus } from '@talismn/icons'
import { IconButton, TextInput } from '@talismn/ui'
import { toSs52Address } from '@util/addresses'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const AddressInput = (
  props: {
    onNewAddress: (a: string) => void
    additionalValidation?: (a: string) => boolean
  } & React.HTMLAttributes<HTMLDivElement>
) => {
  const theme = useTheme()
  const [address, setAddress] = useState('')
  return (
    <div className={props.className}>
      <div css={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        <TextInput
          className={css`
            width: 100% !important;
            font-size: 18px !important;
          `}
          placeholder="e.g. 13DgtSygjb8UeF41B5H25khiczEw2sHXeuWUgzVWrFjfwcUH"
          value={address}
          onChange={event => setAddress(event.target.value)}
        />
        <div
          onClick={() => {
            const validAddress = toSs52Address(address)
            if (!validAddress) {
              toast.error('Invalid address')
            } else {
              props.onNewAddress(validAddress)
              setAddress('')
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
            className={css`
              display: flex;
              gap: 8px;
              height: 40px;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              transition: backdrop-filter 0.1s ease-in-out;
              :hover {
                backdrop-filter: brightness(1.15);
              }
            `}
          >
            <IconButton as="button" size="24px" contentColor={`rgb(${theme.primary})`}>
              <Plus />
            </IconButton>
            <span>Add member</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressInput
