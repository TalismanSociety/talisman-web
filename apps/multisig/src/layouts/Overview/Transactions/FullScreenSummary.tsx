import MemberRow from '@components/MemberRow'
import StatusCircle, { StatusCircleType } from '@components/StatusCircle'
import { css } from '@emotion/css'
import { Share2, Users } from '@talismn/icons'

import TransactionSummaryRow from './TransactionSummaryRow'
import { Transaction } from '.'

enum PillType {
  Pending,
  Approved,
}

const Pill = ({ children, type }: { children: React.ReactNode; type: PillType }) => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        height: 25px;
        background: ${type === PillType.Pending ? 'rgba(244, 143, 69, 0.25)' : 'rgba(56, 212, 72, 0.25)'};
        color: ${type === PillType.Pending ? 'rgba(244, 143, 69, 1)' : 'rgba(56, 212, 72, 1)'};
        border-radius: 12px;
      `}
    >
      {children}
    </div>
  )
}

const Approvals = ({ t }: { t: Transaction }) => {
  return (
    <div css={{ display: 'grid', gap: '14px' }}>
      {Object.entries(t.approvals).map(([address, approval]) => (
        <div css={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <div css={{ width: '100%' }}>
            <MemberRow member={{ address }} />
          </div>
          <a
            className={css`
              grid-area: executedInfo;
              margin-left: 24px;
            `}
            href={`https://subscan.com/${approval ? approval : address}`}
            target="_blank"
            rel="noreferrer"
          >
            <StatusCircle
              type={approval ? StatusCircleType.Success : StatusCircleType.Unknown}
              circleDiameter="24px"
              iconDimentions={{ width: '11px', height: 'auto' }}
            />
          </a>
        </div>
      ))}
    </div>
  )
}

const MultiSendDetails = ({ t }: { t: Transaction }) => {
  const recipients = t.decoded.recipients || []
  return (
    <div
      className={css`
        display: flex;
        height: 57px;
        align-items: center;
        padding: 16px 24px;
        border-radius: 16px;
        color: var(--color-offWhite);
        background-color: var(--color-backgroundLight);
        > svg {
          color: var(--color-primary);
          height: 20px;
          margin-left: 8px;
        }
      `}
    >
      <p css={{ marginTop: '4px' }}>Multi-Send</p>
      <Share2 />
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
        <p css={{ fontSize: '14px', marginTop: '4px' }}>{recipients.length} Recipients</p>
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
        <p css={{ fontSize: '18px', marginTop: '4px' }}>{t.decoded.outgoingToken.amount}</p>
        <img css={{ height: '20px' }} src={t.decoded.outgoingToken.token.logo} alt="token logo" />
        <p css={{ fontSize: '18px', marginTop: '4px' }}>{t.decoded.outgoingToken.token.symbol}</p>
      </div>
    </div>
  )
}

export const FullScreenDialogTitle = ({ t }: { t?: Transaction }) => {
  if (!t) return null

  const pillType =
    Object.values(t.approvals).filter(Boolean).length === Object.values(t.approvals).length
      ? PillType.Approved
      : PillType.Pending
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: 12px;

        > h2 {
          font-weight: bold;
          color: var(--color-foreground);
        }
      `}
    >
      <h2>Transaction Summary</h2>
      <Pill type={pillType}>
        <p css={{ fontSize: '12px', marginTop: '3px' }}>{pillType === PillType.Approved ? 'Approved' : 'Pending'}</p>
      </Pill>
    </div>
  )
}

export const FullScreenDialogContents = ({ t }: { t?: Transaction }) => {
  if (!t) return null

  return (
    <div css={{ display: 'grid', gap: '32px' }}>
      <TransactionSummaryRow t={t} />
      <div css={{ display: 'grid', gap: '13px' }}>
        <h3>Details</h3>
        <MultiSendDetails t={t} />
      </div>
      <div css={{ display: 'grid', gap: '13px' }}>
        <h3>Approvals</h3>
        <Approvals t={t} />
      </div>
    </div>
  )
}
