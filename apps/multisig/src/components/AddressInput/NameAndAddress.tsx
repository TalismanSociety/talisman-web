import truncateMiddle from 'truncate-middle'
import { Chain } from '@domains/chains'
import { Address } from '@util/addresses'

export const NameAndAddress: React.FC<{ address: Address; name?: string; chain?: Chain }> = ({
  address,
  name,
  chain,
}) => {
  if (!name)
    return (
      <p css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>
        {truncateMiddle(address?.toSs58(chain) ?? '', 5, 5, '...')}
      </p>
    )

  return (
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
  )
}
