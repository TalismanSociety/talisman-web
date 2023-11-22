import { Chain } from '@domains/chains'
import { css } from '@emotion/css'
import { Identicon } from '@talismn/ui'
import { Address } from '@util/addresses'
import AddressTooltip from '../AddressTooltip'

const AddressPill = ({ address, chain, name }: { address: Address; chain: Chain; name?: string }) => {
  const ss58Address = address.toSs58(chain)
  return (
    <AddressTooltip address={address} chain={chain} name={name}>
      <div
        className={css`
          display: flex;
          align-items: center;
          height: 25px;
          max-width: 160px;
          border-radius: 100px;
          background-color: var(--color-backgroundLighter);
          padding: 0px 8px;
          font-size: 14px;
          gap: 4px;
          white-space: nowrap;
        `}
      >
        <div css={{ height: 16, width: 16 }}>
          <Identicon value={ss58Address} size={16} />
        </div>
        <p
          css={({ color }) => ({
            color: name ? color.offWhite : color.lightGrey,
            marginTop: 4,
            fontSize: 14,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          })}
        >
          {name ?? address.toShortSs58(chain)}
        </p>
      </div>
    </AddressTooltip>
  )
}

export default AddressPill
