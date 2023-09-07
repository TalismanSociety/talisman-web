import { Button } from '@talismn/ui'
import { css } from '@emotion/css'
import { selectedMultisigState } from '@domains/multisig'
import { Vote, VoteDetails } from '@domains/referenda'
import { useRecoilValue } from 'recoil'
import VoteOptions from './VoteOptions'
import VoteStandard from './mode/VoteStandard'
import { ProposalsDropdown } from './ProposalsDropdown'

type Props = {
  voteDetails: VoteDetails
  onCancel: () => void
  onChange: (v: VoteDetails) => void
  onNext: () => void
}

const VotingForm: React.FC<Props> = ({ onCancel, onChange, onNext, voteDetails }) => {
  const multisig = useRecoilValue(selectedMultisigState)

  const handleVoteChange = (vote: Vote) => {
    // TODO: add custom logic for switching between vote types when Abstain or Split are added
    // e.g. switching from Aye to Nay should not reset lockAmount and conviction
    // but switching from Aye to Abstain should reset accountVote object
    onChange({
      ...voteDetails,
      accountVote: {
        ...voteDetails.accountVote,
        vote,
      },
    })
  }

  const isFormReady =
    voteDetails.referendumId !== undefined &&
    !isNaN(parseFloat(voteDetails.accountVote.lockAmount)) &&
    !voteDetails.accountVote.lockAmount.endsWith('.') &&
    voteDetails.accountVote.lockAmount !== ''

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        width: 490px;
      `}
    >
      <h1 style={{ marginBottom: '32px' }}>Vote Details</h1>
      <div
        className={css`
          display: grid;
          gap: 32px;
          width: 100%;
        `}
      >
        <ProposalsDropdown
          chain={multisig.chain}
          referendumId={voteDetails.referendumId}
          onChange={referendumId => onChange({ ...voteDetails, referendumId })}
        />
        <VoteOptions onChange={handleVoteChange} value={voteDetails.accountVote.vote} />
        <VoteStandard
          conviction={voteDetails.accountVote.conviction}
          lockAmount={voteDetails.accountVote.lockAmount}
          onChange={standardVoteProps =>
            onChange({ ...voteDetails, accountVote: { ...voteDetails.accountVote, ...standardVoteProps } })
          }
        />
        <div
          className={css`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            width: 100%;
            button {
              height: 56px;
            }
          `}
        >
          <Button onClick={onCancel} variant="outlined">
            <h3>Cancel</h3>
          </Button>
          <Button onClick={onNext} disabled={!isFormReady}>
            <h3>Next</h3>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VotingForm
