import { css } from '@emotion/css'
import { Identicon, TextInput } from '@talismn/ui'
import { Address } from '@util/addresses'
import { useMemo, useRef, useState } from 'react'
import { Chain } from '@domains/chains'
import truncateMiddle from 'truncate-middle'
import { useOnClickOutside } from '../../domains/common/useOnClickOutside'

export type AddressWithName = {
  address: Address
  name: string
  type: string
  chain?: Chain

  extensionName?: string
  addressBookName?: string
}

type Props = {
  value?: string
  onChange: (address: Address | undefined, input: string) => void
  addresses?: AddressWithName[]
  chain?: Chain
}

const AddressInput: React.FC<Props> = ({ onChange, value, addresses = [], chain }) => {
  const [input, setInput] = useState(value ?? '')
  const [expanded, setExpanded] = useState(false)
  const [querying, setQuerying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const blur = () => {
    setExpanded(false)
    setQuerying(false)
  }

  useOnClickOutside(containerRef.current, blur)

  const query = value ?? input

  const address = useMemo(() => {
    try {
      const parsedAddress = Address.fromSs58(query)
      if (!parsedAddress) throw new Error('Invalid address')
      return parsedAddress
    } catch (e) {
      return undefined
    }
  }, [query])

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
    return address !== undefined
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

  return (
    <div css={{ width: '100%', position: 'relative' }} ref={containerRef}>
      <TextInput
        className={css`
          width: 100% !important;
          font-size: 18px !important;
        `}
        placeholder="e.g. 13DgtSygjb8UeF41B5H25khiczEw2sHXeuWUgzVWrFjfwcUH"
        value={query}
        onChange={e => {
          setQuerying(true)
          const validInput = handleAddressChange(e.target.value)

          // user pasted a valid address, so they're not searching for a contact
          if (validInput) setQuerying(false)
        }}
        onFocus={() => {
          setExpanded(addresses.length > 0)

          // clean up input if is valid address, since it's likely that user is trying to change another address input
          if (address) {
            handleAddressChange('')
            setQuerying(false)
          }
        }}
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
            filteredAddresses.map(({ address, name, type }) => (
              <div
                key={address.toSs58(chain)}
                onClick={() => {
                  handleAddressChange(address.toSs58(chain))
                  blur()
                }}
                css={{
                  'display': 'flex',
                  'alignItems': 'center',
                  'justifyContent': 'space-between',
                  'padding': '8px 12px',
                  'cursor': 'pointer',
                  ':hover': {
                    filter: 'brightness(1.2)',
                  },
                }}
              >
                <div
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Identicon size={24} value={address.toSs58(chain)} />
                  <div css={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <p
                      css={({ color }) => ({
                        color: color.offWhite,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 120,
                        width: '100%',
                      })}
                    >
                      {name}
                    </p>
                    <p css={({ color }) => ({ color: color.lightGrey, fontSize: 14 })}>
                      {truncateMiddle(address.toSs58(chain), 5, 5, '...')}
                    </p>
                  </div>
                </div>
                <p css={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{type}</p>
              </div>
            ))
          ) : !querying && address ? (
            <div
              css={{
                'display': 'flex',
                'alignItems': 'center',
                'padding': '8px 12px',
                'cursor': 'pointer',
                ':hover': {
                  filter: 'brightness(1.2)',
                },
              }}
              onClick={blur}
            >
              <Identicon size={24} value={address?.toSs58(chain) ?? ''} />
              <p css={({ color }) => ({ color: color.offWhite, marginLeft: 8 })}>
                {truncateMiddle(address?.toSs58(chain) ?? '', 5, 5, '...')}
              </p>
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
