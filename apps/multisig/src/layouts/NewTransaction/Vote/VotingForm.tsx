import { Button } from '@talismn/ui'
import { css } from '@emotion/css'
import { BaseToken } from '@domains/chains'
import { selectedMultisigState, useSelectedMultisig } from '@domains/multisig'
import { VoteDetails, isVoteDetailsComplete } from '@domains/referenda'
import VoteOptions from './VoteOptions'
import VoteStandard from './mode/VoteStandard'
import { ProposalsDropdown } from './ProposalsDropdown'
import { hasPermission } from '@domains/proxy/util'
import { Alert } from '@components/Alert'
import { NewTransactionHeader } from '../NewTransactionHeader'
import { useRecoilValue } from 'recoil'

type Props = {
  token: BaseToken
  voteDetails: VoteDetails
  onChange: (v: VoteDetails) => void
  onNext: () => void
}

const VotingForm: React.FC<Props> = ({ onChange, onNext, token, voteDetails }) => {
  const multisig = useRecoilValue(selectedMultisigState)

  const { hasDelayedPermission, hasNonDelayedPermission } = hasPermission(multisig, 'governance')

  const handleDetailsChange = (details: VoteDetails['details']) => {
    onChange({ referendumId: voteDetails.referendumId, details })
  }

  return (
    <>
      <NewTransactionHeader>Vote Details</NewTransactionHeader>
      <div
        className={css`
          display: grid;
          gap: 32px;
          margin-top: 32px;
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
            width: 100%;
            button {
              height: 56px;
              width: 100%;
            }
          `}
        >
          <Button onClick={onNext} disabled={!isVoteDetailsComplete(voteDetails) || !hasNonDelayedPermission}>
            <h3>Next</h3>
          </Button>
        </div>
        {hasNonDelayedPermission === false &&
          (hasDelayedPermission ? (
            <Alert>
              <p>Time delayed proxies are not supported yet.</p>
            </Alert>
          ) : (
            <Alert>
              <p>Your Vault does not have the proxy permission required to vote on behalf of the proxied account.</p>
            </Alert>
          ))}
      </div>
    </>
  )
}

export default VotingForm
