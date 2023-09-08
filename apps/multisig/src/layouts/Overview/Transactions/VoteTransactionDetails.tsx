import { Transaction } from '@domains/multisig'
import { css } from '@emotion/css'
import { Zap } from '@talismn/icons'
import AmountRow from '@components/AmountRow'

type Props = {
  t: Transaction
}

export const VoteTransactionHeader: React.FC<Props> = ({ t }) => {
  if (!t.decoded || !t.decoded.voteDetails) return null

  const { details, token } = t.decoded.voteDetails

  if (!details.Standard) return null
  return (
    <>
      <p css={{ marginTop: '4px' }}>Vote</p>
      <Zap css={{ marginRight: 'auto' }} />
      <div
        className={css`
          align-items: center;
          background-color: var(--color-backgroundLighter);
          border-radius: 12px;
          color: var(--color-foreground);
          display: flex;
          gap: 8px;
          margin-right: 8px;
          padding: 4px 8px;
        `}
      >
        <div
          className={css`
            background-color: var(--color-status-${details.Standard?.vote.isAye ? 'positive' : 'negative'});
            border-radius: 50%;
            height: 14px;
            width: 14px;
          `}
        />
        <p css={{ fontSize: '14px', marginTop: '4px' }}>{details.Standard?.vote.isAye ? 'Aye' : 'Nay'}</p>
      </div>
      <AmountRow
        balance={{
          amount: details.Standard.balance,
          token,
        }}
      />
    </>
  )
}
