import { css } from '@emotion/css'
import { TextInput } from '@talismn/ui'
import { Address } from '@util/addresses'
import { useState } from 'react'

type Props = {
  value?: string
  onChange: (address: Address | undefined, input: string) => void
}
const AddressInput: React.FC<Props> = ({ onChange, value }) => {
  const [input, setInput] = useState(value ?? '')

  const handleAddressChange = (addressString: string) => {
    let address: Address | undefined
    try {
      const parsedAddress = Address.fromSs58(addressString)
      if (!parsedAddress) throw new Error('Invalid address')
      address = parsedAddress
    } catch (e) {
      address = undefined
    }

    if (value === undefined) setInput(addressString)
    onChange(address, addressString)
  }

  return (
    <div css={{ width: '100%' }}>
      <TextInput
        className={css`
          width: 100% !important;
          font-size: 18px !important;
        `}
        placeholder="e.g. 13DgtSygjb8UeF41B5H25khiczEw2sHXeuWUgzVWrFjfwcUH"
        value={value ?? input}
        onChange={e => handleAddressChange(e.target.value)}
      />
    </div>
  )
}

export default AddressInput
