import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { ExternalLink, Trash } from '@talismn/icons'
import { Identicon } from '@talismn/ui'
import truncateMiddle from 'truncate-middle'

const MemberRow = (props: { member: AugmentedAccount; chain: Chain; onDelete?: () => void; truncate?: boolean }) => {
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
        <Identicon css={{ width: 24, height: 'auto' }} value={props.member.address.toSs58(props.chain)} />
        {props.member.you ? (
          <p>
            {props.member.nickname} <span css={({ color }) => ({ color: color.offWhite })}>(You)</span>
          </p>
        ) : (
          <p css={({ color }) => ({ color: color.offWhite })}>
            {props.truncate
              ? truncateMiddle(props.member.address.toSs58(props.chain), 12, 12, '...')
              : props.member.address.toSs58(props.chain)}
          </p>
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
