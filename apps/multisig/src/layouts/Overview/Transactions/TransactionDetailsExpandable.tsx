import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { tokenPriceState } from '@domains/chains'
import { Balance, Transaction, TransactionType, calcSumOutgoing } from '@domains/multisig'
import { css } from '@emotion/css'
import { useTheme } from '@emotion/react'
import { ChevronRight, List, Send, Share2, Users } from '@talismn/icons'
import { IconButton, Identicon, Skeleton } from '@talismn/ui'
import { balanceToFloat, formatUsd } from '@util/numbers'
import { useMemo, useState } from 'react'
import AceEditor from 'react-ace'
import { Collapse } from 'react-collapse'
import { useRecoilValueLoadable } from 'recoil'
import truncateMiddle from 'truncate-middle'

const AmountRow = ({ balance }: { balance: Balance }) => {
  const price = useRecoilValueLoadable(tokenPriceState(balance.token.coingeckoId))
  const balanceFloat = balanceToFloat(balance)
  return (
    <div
      className={css`
        display: flex;
        gap: 8px;
        align-items: center;
        color: var(--color-foreground);
      `}
    >
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{balanceFloat}</p>
      <img css={{ height: '20px' }} src={balance.token.logo} alt="token logo" />
      <p css={{ fontSize: '18px', marginTop: '4px' }}>{balance.token.symbol}</p>
      {price.state === 'hasValue' ? (
        <p css={{ fontSize: '18px', marginTop: '4px' }}>{`(${formatUsd(balanceFloat * price.contents)})`}</p>
      ) : (
        <Skeleton.Surface css={{ height: '14px', minWidth: '125px' }} />
      )}
    </div>
  )
}

const AddressPill = ({ a }: { a: string }) => {
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
      href={`https://subscan.io/address/${a}`}
      target="_blank"
      rel="noreferrer"
    >
      <Identicon value={a} size={'16px'} />
      <span css={{ marginTop: '3px' }}>{truncateMiddle(a, 5, 5, '...')}</span>
    </a>
  )
}

const MultiSendExpendedDetails = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const recipients = t.decoded.recipients || []
  return (
    <div css={{ paddingBottom: '8px' }}>
      {t.decoded.recipients.map((r, i) => {
        const { address, balance } = r
        const last = i === recipients.length - 1
        return (
          <div
            key={address}
            css={{
              display: 'grid',
              gap: '16px',
              borderBottom: `${last ? '0px' : '1px'} solid rgb(${theme.backgroundLighter})`,
              padding: `${last ? '24px 0 0 0' : '24px 0'}`,
            }}
          >
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
              <div css={{ marginLeft: 'auto' }}>
                <AmountRow balance={balance} />
              </div>
            </div>
            <div css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Destination
              <AddressPill a={address} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const AdvancedExpendedDetails = ({ t }: { t: Transaction }) => {
  return (
    <div css={{ paddingBottom: '8px' }}>
      <AceEditor
        mode="yaml"
        theme="twilight"
        value={t.decoded.yaml}
        readOnly={true}
        name="yaml"
        setOptions={{ useWorker: false }}
        style={{ width: '100%', border: '1px solid #232323' }}
      />
    </div>
  )
}

const TransactionDetailsExpandable = ({ t }: { t: Transaction }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const sumOutgoing: Balance[] = useMemo(() => calcSumOutgoing(t), [t])

  const recipients = t.decoded.recipients || []
  return (
    <div
      className={css`
        display: grid;
        align-content: center;
        width: 100%;
        padding: 8px 24px;
        border-radius: 16px;
        background-color: var(--color-backgroundLight);
        min-height: 56px;
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
            <p css={{ marginTop: '4px' }}>Send</p>
            <Send />
          </>
        ) : t.decoded.type === TransactionType.Advanced ? (
          <>
            <p css={{ marginTop: '4px' }}>Advanced</p>
            <List />
          </>
        ) : null}
        {t.decoded.type === TransactionType.MultiSend ? (
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
        ) : t.decoded.type === TransactionType.Transfer ? (
          <div
            className={css`
              color: var(--color-foreground);
              margin-right: 16px;
              margin-left: auto;
            `}
          >
            <AddressPill a={recipients[0]?.address || ''} />
          </div>
        ) : null}
        {t.decoded.type !== TransactionType.Advanced && (
          <div css={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
            {sumOutgoing.map(b => {
              return <AmountRow key={b.token.id} balance={b} />
            })}
          </div>
        )}
        {t.decoded.type === TransactionType.MultiSend || t.decoded.type === TransactionType.Advanced ? (
          <div css={{ width: '28px', marginLeft: t.decoded.type === TransactionType.MultiSend ? '0' : 'auto' }}>
            <IconButton
              contentColor={`rgb(${theme.offWhite})`}
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
        ) : null}
      </div>
      <div
        className={css`
          .ReactCollapse--collapse {
            transition: height 300ms;
          }
        `}
      >
        <Collapse isOpened={expanded}>
          {t.decoded.type === TransactionType.MultiSend ? (
            <MultiSendExpendedDetails t={t} />
          ) : t.decoded.type === TransactionType.Advanced ? (
            <AdvancedExpendedDetails t={t} />
          ) : null}
        </Collapse>
      </div>
    </div>
  )
}

export default TransactionDetailsExpandable
