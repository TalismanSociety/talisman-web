import truncateMiddle from 'truncate-middle'
import { Chain } from '@domains/chains'
import { Address } from '@util/addresses'

export const NameAndAddress: React.FC<{
  address: Address
  name?: string
  chain?: Chain
  nameOrAddressOnly?: boolean
  breakLine?: boolean
}> = ({ address, name, chain, nameOrAddressOnly, breakLine }) => {
  if (!name)
    return (
      <p css={({ color }) => ({ color: color.offWhite, marginTop: 6 })}>
        {truncateMiddle(address?.toSs58(chain) ?? '', 5, 5, '...')}
      </p>
    )

  return (
    <div
      css={{
        display: 'flex',
        gap: breakLine ? 0 : 8,
        flexDirection: breakLine ? 'column' : 'row',
        alignItems: breakLine ? 'flex-start' : 'center',
        marginTop: breakLine ? 0 : 4,
      }}
    >
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
      {!nameOrAddressOnly && (
        <p css={({ color }) => ({ color: color.lightGrey, fontSize: 12 })}>
          {truncateMiddle(address.toSs58(chain), 5, 5, '...')}
        </p>
      )}
    </div>
  )
}
