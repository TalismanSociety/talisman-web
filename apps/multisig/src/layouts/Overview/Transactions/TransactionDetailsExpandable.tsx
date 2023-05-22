import { Token } from 'domain/chains'

import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ChevronRight, List, Send, Share2, Users } from '@talismn/icons'
import { IconButton, Identicon } from '@talismn/ui'
import { formatUsd } from '@util/numbers'
import { useState } from 'react'
import { Collapse } from 'react-collapse'
import truncateMiddle from 'truncate-middle'

import { Transaction, TransactionType } from '.'

const AmountRow = ({ amount, token, price }: { amount: number; token?: Token; price: number }) => {
  return (
    <div
      className={css`
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--color-foreground);
      `}
    >
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{amount}</p>
      <img css={{ height: '20px' }} src={token?.logo} alt="token logo" />
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{token?.symbol}</p>
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{`(${formatUsd(amount * price)})`}</p>
    </div>
  )
}

const TransactionDetailsExpandable = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const recipients = t.decoded.recipients || []
  return (
    <div
      className={css`
        padding: 8px 24px;
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
            <Send />
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
            margin-right: 16px;
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
        <AmountRow
          amount={t.decoded.outgoingToken?.amount || 0}
          token={t.decoded.outgoingToken?.token}
          price={t.decoded.outgoingToken?.price || 0}
        />
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
            transition: height 300ms;
          }
        `}
      >
        <Collapse isOpened={expanded}>
          <div css={{ paddingBottom: '8px' }}>
            {t.decoded.recipients.map(([addr, amt], i) => {
              return (
                <div>
                  <div css={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span css={{ color: 'var(--color-offWhite)' }}>Send</span>
                    <IconButton contentColor={`rgb(${theme.primary})`} size={'20px'}>
                      <Send size={'16px'} />
                    </IconButton>
                    <div
                      className={css`
                        display: flex;
                        align-items: center;
                        height: 25px;
                        border-radius: 100px;
                        background-color: var(--color-backgroundLighter);
                        padding: 8px 14px;
                        font-size: 14px;
                        gap: 4px;
                        margin-left: 8px;
                      `}
                    >
                      <span css={{ marginTop: '3px' }}>
                        {i + 1} of {recipients.length}
                      </span>
                    </div>
                  </div>
                  <AmountRow
                    amount={amt}
                    token={t.decoded?.outgoingToken?.token}
                    price={t.decoded.outgoingToken?.price || 0}
                  />
                  <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Destination
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
                      href={`https://subscan.io/address/${addr}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Identicon value={addr} size={'16px'} />
                      <span css={{ marginTop: '3px' }}>{truncateMiddle(addr, 5, 5, '...')}</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </Collapse>
      </div>
    </div>
  )
}

export default TransactionDetailsExpandable
