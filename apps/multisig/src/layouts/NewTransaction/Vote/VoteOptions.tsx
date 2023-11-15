import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { VoteDetails, defaultVoteDetails } from '@domains/referenda'

type Props = {
  value: VoteDetails['details']
  onChange: (v: VoteDetails['details']) => void
}

const VoteOptions: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div
      className={css`
        background-color: var(--color-backgroundSecondary);
        border-radius: 12px;
        display: flex;
        gap: 4px;
        padding: 4px;
        button {
          width: 100%;
        }
      `}
    >
      <Button
        onClick={() => {
          const standardVoteDetails = value.Standard ?? defaultVoteDetails.Standard
          standardVoteDetails.vote.aye = true
          onChange({
            Standard: standardVoteDetails,
          })
        }}
        variant={value.Standard?.vote.aye ? undefined : 'secondary'}
      >
        Aye
      </Button>
      <Button
        onClick={() => {
          const standardVoteDetails = value.Standard ?? defaultVoteDetails.Standard
          standardVoteDetails.vote.aye = false
          onChange({
            Standard: standardVoteDetails,
          })
        }}
        css={({ color }) => ({ backgroundColor: value.Standard?.vote.aye === false ? '#f46161' : undefined })}
        variant={value.Standard?.vote.aye === false ? undefined : 'secondary'}
      >
        Nay
      </Button>
    </div>
  )
}

export default VoteOptions
