import { css } from '@emotion/css'
import { useState } from 'react'
import { Vote, VoteDetails } from '@domains/referenda'
import VotingForm from './VotingForm'
import { SideSheet } from '@talismn/ui'

type Props = {
  onCancel: () => void
}

// TODO: handle constants.convictionVoting.maxVotes
const VoteAction: React.FC<Props> = ({ onCancel }) => {
  const [reviewing, setReviewing] = useState(false)
  const [voteDetails, setVoteDetails] = useState<VoteDetails>({
    accountVote: {
      conviction: 1,
      lockAmount: '',
      vote: Vote.Aye,
    },
  })

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        padding: 32px;
      `}
    >
      <VotingForm
        voteDetails={voteDetails}
        onChange={setVoteDetails}
        onCancel={onCancel}
        onNext={() => setReviewing(true)}
      />
      <SideSheet open={reviewing} onRequestDismiss={() => setReviewing(false)} title="" />
    </div>
  )
}

export default VoteAction
