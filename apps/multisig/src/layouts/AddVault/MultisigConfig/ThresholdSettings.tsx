import { Select } from '@talismn/ui'
import { useEffect } from 'react'

type Props = {
  threshold: number
  onChange: (threshold: number) => void
  membersCount: number
}

export const ThresholdSettings: React.FC<Props> = ({ membersCount, onChange, threshold }) => {
  useEffect(() => {
    if (threshold > membersCount) {
      onChange(membersCount)
    } else if (threshold === 1 && membersCount > 1) {
      onChange(2)
    }
  }, [membersCount, onChange, threshold])

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div css={{ width: '100%' }}>
        <h2 css={({ color }) => ({ fontSize: 20, color: color.offWhite })}>Threshold</h2>
        <p css={{ marginTop: 4 }}>Select the amount of approvals required to execute a transaction.</p>
      </div>
      <div
        css={({ color }) => ({ display: 'flex', gap: 8, alignItems: 'center', color: color.offWhite, marginTop: 8 })}
      >
        {
          <Select
            backgroundColor="var(--color-grey800)"
            css={({ color }) => ({
              button: {
                gap: 8,
                paddingRight: 8,
                backgroundColor: 'var(--color-grey800)',
                svg: { color: color.lightGrey },
              },
            })}
            placeholder={<p css={({ color }) => ({ color: color.offWhite })}>{membersCount <= 1 ? '-' : threshold}</p>}
            onChange={onChange}
          >
            {Array.from({ length: membersCount - 1 }, (_, i) => i + 2).map(i => (
              <Select.Option key={i} leadingIcon={<p>{i}</p>} headlineText={null} value={i} />
            ))}
          </Select>
        }
        <p>out of {membersCount} Members</p>
      </div>
    </div>
  )
}
