import { css } from '@emotion/css'
import { TextInput } from '@talismn/ui'
import { Address } from '@util/addresses'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Chain } from '@domains/chains'
import { useOnClickOutside } from '@domains/common/useOnClickOutside'
import { SelectedAddress } from './SelectedAddressPill'
import { AccountDetails } from './AccountDetails'

export type AddressWithName = {
  address: Address
  name: string
  type: string
  chain?: Chain

  extensionName?: string
  addressBookName?: string
}

type Props = {
  defaultAddress?: Address
  value?: string
  onChange: (address: Address | undefined, input: string) => void
  addresses?: AddressWithName[]
  chain?: Chain
  leadingLabel?: string
  compact?: boolean
}

/**
 * Handles validating address input as well as displaying a list of addresses to select from.
 * Supports both controlled and uncontrolled usage input.
 */
const AddressInput: React.FC<Props> = ({
  onChange,
  value,
  defaultAddress,
  addresses = [],
  chain,
  leadingLabel,
  compact,
}) => {
  const [input, setInput] = useState(value ?? '')
  const [expanded, setExpanded] = useState(false)
  const [querying, setQuerying] = useState(false)
  const [address, setAddress] = useState(defaultAddress ?? (value ? Address.fromSs58(value) || undefined : undefined))
  const [contact, setContact] = useState<AddressWithName | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined && value === '') setAddress(undefined)
  }, [value])

  const blur = () => {
    setExpanded(false)
    setQuerying(false)
  }

  useOnClickOutside(containerRef.current, blur)

  const query = value ?? input

  // input displays a non editable pill that shows selected contact's name, address and identicon
  const controlledSelectedInput = address !== undefined

  const handleQueryChange = (addressString: string) => {
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
    return address !== undefined
  }

  const handleSelectFromList = (address: Address, contact?: AddressWithName) => {
    handleQueryChange(address.toSs58(chain))
    setAddress(address)
    setContact(contact)
    blur()
  }

  const handleClearInput = () => {
    setExpanded(addresses.length > 0)

    // clear states
    handleQueryChange('')
    setContact(undefined)
    setAddress(undefined)
    setQuerying(false)
  }

  const filteredAddresses = useMemo(() => {
    let inputAddress: Address | undefined
    try {
      const parsedInputAddress = Address.fromSs58(query)
      if (parsedInputAddress) inputAddress = parsedInputAddress
    } catch (e) {}

    return addresses.filter(({ address, name }) => {
      if (inputAddress && inputAddress.isEqual(address)) return true
      if (name.toLowerCase().includes(query.toLowerCase())) return true

      const addressString = address.toSs58(chain)
      const genericAddressString = address.toSs58()
      return (
        addressString.toLowerCase().includes(query.toLowerCase()) ||
        genericAddressString.toLowerCase().includes(query.toLowerCase())
      )
    })
  }, [addresses, chain, query])

  const validRawInputAddress = useMemo(() => {
    try {
      const parsedInputAddress = Address.fromSs58(query)
      if (parsedInputAddress) return parsedInputAddress
    } catch (e) {}

    return undefined
  }, [query])

  return (
    <div css={{ width: '100%', position: 'relative' }} ref={containerRef}>
      {controlledSelectedInput && (
        <SelectedAddress address={address} chain={chain} name={contact?.name} onClear={handleClearInput} />
      )}
      <TextInput
        leadingLabel={leadingLabel}
        className={css`
          font-size: 18px !important;
          cursor: ${address ? 'pointer' : 'text'};
        `}
        placeholder={
          controlledSelectedInput ? '' : addresses.length > 0 ? 'Search or paste address...' : 'Enter address...'
        }
        value={address ? '' : query}
        onChange={e => {
          setQuerying(true)
          const validInput = handleQueryChange(e.target.value)

          // user pasted a valid address, so they're no longer querying
          if (validInput) {
            setQuerying(false)
            setExpanded(true)
          }
        }}
        onFocus={() => setExpanded(addresses.length > 0 || validRawInputAddress !== undefined)}
      />
      <div
        css={({ color }) => ({
          position: 'absolute',
          top: '100%',
          marginTop: 8,
          left: 0,
          backgroundColor: color.foreground,
          width: '100%',
          zIndex: 1,
          borderRadius: 8,

          height: 'max-content',
          maxHeight: expanded ? 150 : 0,
          overflow: 'hidden',
          transition: '0.2s ease-in-out',
          overflowY: 'auto',
        })}
      >
        <div css={{ padding: '8px 0px' }}>
          {filteredAddresses.length > 0 ? (
            filteredAddresses.map(contact => (
              <div
                key={contact.address.toSs58(chain)}
                onClick={() => handleSelectFromList(contact.address, contact)}
                css={{
                  'display': 'flex',
                  'alignItems': 'center',
                  'justifyContent': 'space-between',
                  'padding': '8px 12px',
                  'cursor': 'pointer',
                  ':hover': { filter: 'brightness(1.2)' },
                }}
              >
                <AccountDetails
                  name={contact.name}
                  chain={chain}
                  address={contact.address}
                  disableCopy
                  breakLine={compact}
                  identiconSize={compact ? 32 : 24}
                />
                <p css={({ color }) => ({ fontSize: 14, fontWeight: 700, textAlign: 'right', color: color.lightGrey })}>
                  {contact.type}
                </p>
              </div>
            ))
          ) : !querying && validRawInputAddress ? (
            // user pasted an unknown but valid address, show identicon and formatted address to indicate the address is valid
            <div
              css={{
                'padding': '8px 12px',
                'cursor': 'pointer',
                ':hover': {
                  filter: 'brightness(1.2)',
                },
              }}
              onClick={() => handleSelectFromList(validRawInputAddress)}
            >
              <AccountDetails
                address={validRawInputAddress}
                chain={chain}
                disableCopy
                breakLine={compact}
                identiconSize={compact ? 32 : 24}
              />
            </div>
          ) : (
            <p css={{ textAlign: 'center', padding: 12 }}>No result found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressInput
