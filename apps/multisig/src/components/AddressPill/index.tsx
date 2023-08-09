import { Chain } from '@domains/chains'
import { css } from '@emotion/css'
import { Identicon } from '@talismn/ui'
import { Address, toSubscanUrl } from '@util/addresses'
import truncateMiddle from 'truncate-middle'

const AddressPill = ({ address, chain }: { address: Address; chain: Chain }) => {
  const ss52Address = address.toSs52(chain)
  return (
    <a
      className={css`
        display: flex;
        align-items: center;
        height: 25px;
        width: 138px;
        border-radius: 100px;
        background-color: var(--color-backgroundLighter);
        padding-left: 8px;
        font-size: 14px;
        gap: 4px;
      `}
      href={toSubscanUrl(address, chain)}
      target="_blank"
      rel="noreferrer"
    >
      <Identicon value={ss52Address} size={'16px'} />
      <span css={{ marginTop: '3px' }}>{truncateMiddle(ss52Address, 5, 5, '...')}</span>
    </a>
  )
}

export default AddressPill
