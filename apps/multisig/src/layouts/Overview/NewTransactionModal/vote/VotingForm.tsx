import { Button } from '@talismn/ui'
import { css } from '@emotion/css'
import { BaseToken } from '@domains/chains'
import { useSelectedMultisig } from '@domains/multisig'
import { VoteDetails, isVoteDetailsComplete } from '@domains/referenda'
import VoteOptions from './VoteOptions'
import VoteStandard from './mode/VoteStandard'
import { ProposalsDropdown } from './ProposalsDropdown'
import { hasPermission } from '../../../../domains/proxy/util'
import { AlertCircle } from '@talismn/icons'

type Props = {
  token: BaseToken
  voteDetails: VoteDetails
  onCancel: () => void
  onChange: (v: VoteDetails) => void
  onNext: () => void
}

const VotingForm: React.FC<Props> = ({ onCancel, onChange, onNext, token, voteDetails }) => {
  const [multisig] = useSelectedMultisig()

  const canVote = hasPermission(multisig, 'governance')

  const handleDetailsChange = (details: VoteDetails['details']) => {
    onChange({ referendumId: voteDetails.referendumId, details })
  }

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        max-width: 490px;
        width: 100%;
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
        <VoteOptions onChange={handleDetailsChange} value={voteDetails.details} />
        {voteDetails.details.Standard ? (
          <VoteStandard onChange={handleDetailsChange} token={token} params={voteDetails.details.Standard} />
        ) : // TODO: add UI for Abstain and Split votes
        null}
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
          <Button onClick={onNext} disabled={!isVoteDetailsComplete(voteDetails) || canVote === false}>
            <h3>Next</h3>
          </Button>
        </div>
        {canVote === false && (
          <div
            css={({ color }) => ({
              display: 'flex',
              gap: 12,
              backgroundColor: color.surface,
              marginTop: 24,
              color: color.lightGrey,
              padding: 16,
              maxWidth: 490,
              borderRadius: 12,
              p: { fontSize: 14 },
            })}
          >
            <AlertCircle size={32} />
            <p>Your Vault does not have the proxy permission required to vote on behalf of the proxied account.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VotingForm
