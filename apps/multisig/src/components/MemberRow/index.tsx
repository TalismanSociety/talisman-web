import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { ExternalLink, Trash } from '@talismn/icons'
import { Identicon } from '@talismn/ui'
import { shortenAddress } from '../../util/addresses'

const MemberRow = (props: { member: AugmentedAccount; chain: Chain; onDelete?: () => void; truncate?: boolean }) => {
  const address = props.member.address.toSs58(props.chain)
  const shortAddress = props.member.address.toShortSs58(props.chain)
  return (
    <div
      className={css`
        align-items: center;
        display: flex;
        justify-content: space-between;
        > p {
          font-size: 16px !important;
        }
        > div {
          align-items: center;
          display: flex;
        }
      `}
    >
      <div css={{ gap: 8 }}>
        <Identicon css={{ width: 24, height: 'auto' }} value={address} />
        {props.member.nickname ? (
          <p css={({ color }) => ({ color: color.offWhite })}>
            {props.member.nickname} <span css={({ color }) => ({ color: color.lightGrey })}>{shortAddress}</span>
            {props.member.you ? <span> (You)</span> : ''}
          </p>
        ) : (
          <p css={({ color }) => ({ color: color.offWhite })}>{shortenAddress(address, 'long')}</p>
        )}
      </div>
      <div css={{ gap: 16 }}>
        {props.onDelete ? (
          <div
            onClick={props.onDelete}
            css={({ foreground }) => ({ color: `rgb(${foreground})`, cursor: 'pointer', height: 16 })}
          >
            <Trash size={16} />
          </div>
        ) : (
          <div />
        )}
        <a
          css={{ lineHeight: 1, height: 16 }}
          href={props.member.address.toSubscanUrl(props.chain)}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size="16px" />
        </a>
      </div>
    </div>
  )
}

export default MemberRow
