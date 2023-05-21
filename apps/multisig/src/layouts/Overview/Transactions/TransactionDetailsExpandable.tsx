import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ArrowUp, ChevronRight, List, Share2, Users } from '@talismn/icons'
import { IconButton } from '@talismn/ui'
import { useState } from 'react'
import { Collapse } from 'react-collapse'

import { Transaction, TransactionType } from '.'

const TransactionDetailsExpandable = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const recipients = t.decoded.recipients || []
  return (
    <div
      className={css`
        padding: 8px 24px;
        padding-bottom: 16px;
        border-radius: 16px;
        background-color: var(--color-backgroundLight);
        height: auto;
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          color: var(--color-offWhite);
          > svg {
            color: var(--color-primary);
            height: 20px;
            margin-left: 8px;
          }
        `}
      >
        {t.decoded.type === TransactionType.MultiSend ? (
          <>
            <p css={{ marginTop: '4px' }}>Multi-Send</p>
            <Share2 />
          </>
        ) : t.decoded.type === TransactionType.Transfer ? (
          <>
            <p css={{ marginTop: '4px' }}>Transfer</p>
            <ArrowUp />
          </>
        ) : t.decoded.type === TransactionType.Other ? (
          <>
            <p css={{ marginTop: '4px' }}>Other</p>
            <List />
          </>
        ) : null}
        <div
          className={css`
            display: flex;
            margin-left: auto;
            align-items: center;
            gap: 4px;
            height: 25px;
            background-color: var(--color-backgroundLighter);
            color: var(--color-foreground);
            border-radius: 12px;
            padding: 5px 8px;
          `}
        >
          <div
            className={css`
              display: flex;
              align-items: center;
              height: 16px;
              width: 16px;
              border-radius: 100px;
              background-color: var(--color-dim);
              svg {
                color: var(--color-primary);
                height: 8px;
              }
            `}
          >
            <Users />
          </div>
          <p css={{ fontSize: '14px', marginTop: '4px' }}>
            {recipients.length} Recipient{recipients.length !== 1 && 's'}
          </p>
        </div>
        <div
          className={css`
            margin-left: 16px;
            display: flex;
            gap: 8px;
            align-items: center;
            color: var(--color-foreground);
          `}
        >
          <p css={{ fontSize: '18px', marginTop: '4px' }}>{t.decoded.outgoingToken?.amount}</p>
          <img css={{ height: '20px' }} src={t.decoded.outgoingToken?.token.logo} alt="token logo" />
          <p css={{ fontSize: '18px', marginTop: '4px' }}>{t.decoded.outgoingToken?.token.symbol}</p>
        </div>
        <div>
          <IconButton
            contentColor={`rgb(${theme.foreground})`}
            onClick={() => {
              setExpanded(!expanded)
            }}
            className={css`
              ${expanded && 'transform: rotate(90deg);'}
            `}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>
      <div
        className={css`
          .ReactCollapse--collapse {
            transition: height 100ms;
          }
        `}
      >
        <Collapse isOpened={expanded}>hello here is more content!</Collapse>
      </div>
    </div>
  )
}

export default TransactionDetailsExpandable
