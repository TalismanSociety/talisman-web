import { Chain } from '@domains/chains'
import { AugmentedAccount } from '@domains/multisig'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ExternalLink, Trash } from '@talismn/icons'
import { IconButton, Identicon } from '@talismn/ui'
import truncateMiddle from 'truncate-middle'

export const Member = ({ m, chain, onDelete }: { m: AugmentedAccount; onDelete?: () => void; chain: Chain }) => {
  const theme = useTheme()

  const ss58Address = m.address.toSs58(chain)
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        background: var(--color-backgroundSecondary);
        border: 1px solid var(--color-backgroundSecondary);
        border-radius: 12px;
        padding: 16px;
        gap: 8px;
      `}
    >
      <Identicon value={ss58Address} size={32} />
      <div css={{ display: 'grid', alignItems: 'center' }}>
        <p css={{ display: 'flex', marginTop: 4 }}>
          {m.nickname ? (
            <span css={({ color }) => ({ color: color.offWhite })}>{m.nickname}</span>
          ) : (
            <span css={{ color: 'var(--color-offWhite)' }}>{truncateMiddle(ss58Address, 10, 10, '...')}</span>
          )}
          &nbsp;
          {m.you && <span>(You)</span>}
        </p>
        {m.nickname ? <span css={{ fontSize: '12px' }}>{truncateMiddle(ss58Address, 4, 5, '...')}</span> : null}
      </div>
      <div css={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '8px' }}>
        {onDelete && (
          <IconButton size={16} contentColor={`rgb(${theme.foreground})`} onClick={onDelete}>
            <Trash size={16} />
          </IconButton>
        )}
        <a href={m.address.toSubscanUrl(chain)} target="_blank" rel="noreferrer">
          <IconButton size={16} contentColor={`rgb(${theme.foreground})`} css={{ cursor: 'pointer' }}>
            <ExternalLink size={16} />
          </IconButton>
        </a>
      </div>
    </div>
  )
}
