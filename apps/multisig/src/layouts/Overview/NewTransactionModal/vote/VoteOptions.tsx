import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { Vote } from '@domains/referenda'

type Props = {
  value: Vote
  onChange: (v: Vote) => void
}

const options = [
  {
    label: 'Aye',
    value: Vote.Aye,
  },
  {
    label: 'Nay',
    value: Vote.Nay,
  },
]

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
      {options.map(option => (
        <Button
          key={option.value}
          onClick={() => onChange(option.value)}
          variant={value === option.value ? undefined : 'secondary'}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default VoteOptions
