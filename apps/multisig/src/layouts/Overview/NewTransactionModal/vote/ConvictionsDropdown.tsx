import { css } from '@emotion/css'
import { Select } from '@talismn/ui'

type Props = {
  conviction: number
  onChange: (conviction: number) => void
}

const CONVICTIONS = [1, 2, 4, 8, 16, 32].map((lock, index): [value: number, duration: number] => [index + 1, lock])

export function createConvictionsOpts(): { headlineText: string; value: number }[] {
  return [
    { headlineText: '0.1x voting balance, no lockup period', value: 0 },
    ...CONVICTIONS.map(([value, duration]) => ({
      // TODO: show duration in human readable format (e.g. 1d, 7d)
      headlineText: `${value}x voting balance, locked for ${duration}x period`,
      value,
    })),
  ]
}

// ref: https://github.com/polkadot-js/apps/blob/master/packages/react-components/src/ConvictionDropdown.tsx
const ConvictionsDropdown: React.FC<Props> = ({ conviction, onChange }) => {
  const options = createConvictionsOpts()
  return (
    <Select
      className={css`
        button {
          height: 56px;
        }
      `}
      onChange={onChange}
      value={conviction}
    >
      {options.map(({ headlineText, value }) => (
        <Select.Option key={value} headlineText={headlineText} value={value} />
      ))}
    </Select>
  )
}

export default ConvictionsDropdown
