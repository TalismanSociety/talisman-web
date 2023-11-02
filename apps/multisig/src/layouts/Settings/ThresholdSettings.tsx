import { Select } from '@talismn/ui'
import { useEffect } from 'react'

type Props = {
  threshold: number
  onChange: (threshold: number) => void
  membersCount: number
  disabled?: boolean
}

export const ThresholdSettings: React.FC<Props> = ({ disabled, membersCount, onChange, threshold }) => {
  useEffect(() => {
    if (threshold > membersCount) onChange(membersCount)
  }, [membersCount, onChange, threshold])
  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p css={({ color }) => ({ color: color.offWhite, fontSize: 14, marginTop: 2 })}>Threshold</p>
      <p css={({ color }) => ({ color: color.lightGrey, fontSize: 14, marginTop: 2 })}>
        The number of approvals required to execute a transaction.
      </p>
      <div
        css={({ color }) => ({ display: 'flex', gap: 8, alignItems: 'center', color: color.offWhite, marginTop: 8 })}
      >
        {disabled ? (
          <div
            css={({ color }) => ({
              backgroundColor: color.surface,
              padding: '8px 12.5px',
              color: color.offWhite,
              borderRadius: 12,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            {threshold}
          </div>
        ) : (
          <Select
            css={({ color }) => ({ button: { gap: 8, paddingRight: 8, svg: { color: color.lightGrey } } })}
            placeholder={<p css={({ color }) => ({ color: color.offWhite })}>{threshold}</p>}
            onChange={onChange}
          >
            {Array.from({ length: membersCount - 1 }, (_, i) => i + 2).map(i => (
              <Select.Option key={i} leadingIcon={<p>{i}</p>} headlineText={null} value={i} />
            ))}
          </Select>
        )}
        <p>out of {membersCount} Members</p>
      </div>
    </div>
  )
}
