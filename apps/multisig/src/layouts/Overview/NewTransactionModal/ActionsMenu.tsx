import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { List, Send, Share2, Zap } from '@talismn/icons'
import { IconButton, Tooltip } from '@talismn/ui'
import { ReactNode } from 'react'

import { Action } from '.'

const ActionButton = ({
  name,
  description,
  icon,
  disabled,
  onClick,
}: {
  name: string
  description: string
  icon: ReactNode
  disabled?: boolean
  onClick?: () => void
}) => {
  const theme = useTheme()
  return (
    <div
      onClick={onClick}
      className={css`
        display: grid;
        grid-template-rows: 1fr auto;
        height: 180px;
        min-width: 300px;
        max-width: 380px;
        padding: 32px;
        border-radius: 16px;
        background: rgba(250, 250, 250, 0.05);
        transition: all 150ms ease-in-out;
        opacity: ${disabled ? '0.5' : '1'};
        pointer-events: ${disabled ? 'none' : 'all'};
        cursor: pointer;
        :hover {
          * > h1,
          span,
          svg {
            color: black;
          }
          background: var(--color-offWhite);
        }
      `}
    >
      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>{name}</h1>
        <IconButton size={40} contentColor={`rgb(${theme.offWhite})`}>
          {icon}
        </IconButton>
      </div>
      <span>{description}</span>
    </div>
  )
}

const ActionsMenu = (props: { onActionClick: (action: Action) => void }) => {
  return (
    <div css={{ display: 'grid', justifyContent: 'center', paddingTop: '24px' }}>
      <div
        className={css`
          display: grid;
          justify-items: center;
          max-width: 784px;
        `}
      >
        <span css={{ color: 'var(--color-offWhite)', fontSize: '32px' }}>Select an action</span>
        <div css={{ display: 'grid', gap: '24px', marginTop: '64px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <ActionButton
            name="Send"
            description="Transfer funds to a single address"
            icon={<Send size={33} />}
            onClick={() => props.onActionClick(Action.Send)}
          />
          <ActionButton
            name="Advanced"
            description="Craft a custom transaction"
            icon={<List size={33} />}
            onClick={() => props.onActionClick(Action.Advanced)}
          />
          <ActionButton
            name="Multi-send"
            description="Transfer funds to a multiple addresses"
            icon={<Share2 size={33} />}
            onClick={() => props.onActionClick(Action.MultiSend)}
          />
          <Tooltip content={'Stake action coming soon'}>
            {/* {tooltipProps => ( */}
            <div css={{ display: 'inline' }}>
              <ActionButton
                name="Stake"
                description="Stake your vaults assets"
                icon={<Zap size={33} />}
                disabled={true}
              />
            </div>
            {/* )} */}
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default ActionsMenu
