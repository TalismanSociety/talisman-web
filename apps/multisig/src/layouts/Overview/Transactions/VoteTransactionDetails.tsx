import { Transaction, TransactionType } from '@domains/multisig'
import { css } from '@emotion/css'
import { Zap } from '@talismn/icons'
import AmountRow from '@components/AmountRow'
import { createConvictionsOpts } from '../NewTransactionModal/vote/ConvictionsDropdown'
import { VoteDetails } from '../../../domains/referenda'

type Props = {
  t: Transaction
}

const VotePill: React.FC<{ details: VoteDetails['details'] }> = ({ details }) => (
  <div
    className={css`
      align-items: center;
      background-color: var(--color-backgroundLighter);
      border-radius: 12px;
      color: var(--color-foreground);
      display: flex;
      gap: 8px;
      padding: 2px 8px;
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
)

export const VoteTransactionHeader: React.FC<Props> = ({ t }) => {
  if (t.decoded?.type !== TransactionType.Vote || !t.decoded.voteDetails) return null

  const { details, token } = t.decoded.voteDetails

  if (!details.Standard) return null

  return (
    <>
      <p css={{ marginTop: '4px' }}>Vote</p>
      <Zap css={{ marginRight: 'auto' }} />
      <div css={{ marginRight: '8px' }}>
        <VotePill details={details} />
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

export const VoteExpandedDetails: React.FC<Props> = ({ t }) => {
  if (t.decoded?.type !== TransactionType.Vote || !t.decoded.voteDetails) return null

  const { details, token, referendumId } = t.decoded.voteDetails
  const convictionsOptions = createConvictionsOpts()

  if (!details.Standard) return null

  return (
    <div css={{ paddingBottom: '8px' }}>
      <div
        className={css`
          display: grid;
          gap: 16px;
          padding-top: 24px;
          > div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        `}
      >
        <div>
          <p css={{ color: 'var(--color-offWhite)' }}>Referendum #{referendumId}</p>
          <VotePill details={details} />
        </div>
        <div>
          <p>Vote value</p>
          <AmountRow
            balance={{
              amount: details.Standard.balance,
              token,
            }}
          />
        </div>
        <div>
          <p>Conviction</p>
          <div>{convictionsOptions[details.Standard.vote.conviction]?.headlineText ?? 'Unknown'}</div>
        </div>
      </div>
    </div>
  )
}
