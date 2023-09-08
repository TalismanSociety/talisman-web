import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { VoteDetails } from '@domains/referenda'
import BN from 'bn.js'

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
        onClick={() =>
          onChange({
            Standard: {
              balance: value.Standard?.balance ?? new BN(0),
              vote: {
                conviction: value.Standard?.vote.conviction ?? 1,
                aye: true,
              },
            },
          })
        }
        variant={value.Standard?.vote.aye ? undefined : 'secondary'}
      >
        Aye
      </Button>
      <Button
        onClick={() =>
          onChange({
            Standard: {
              balance: value.Standard?.balance ?? new BN(0),
              vote: {
                conviction: value.Standard?.vote.conviction ?? 1,
                aye: false,
              },
            },
          })
        }
        variant={value.Standard?.vote.aye === false ? undefined : 'secondary'}
      >
        Nay
      </Button>
    </div>
  )
}

export default VoteOptions
