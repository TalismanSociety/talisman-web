import { Info } from '@talismn/icons'
import { Tooltip } from '@talismn/ui'

type Props = {
  label: string
  tooltip?: React.ReactNode
}

export const SettingsInfoRow: React.FC<React.PropsWithChildren<Props>> = ({ label, tooltip, children }) => (
  <div css={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div css={({ color }) => ({ display: 'flex', gap: 8, color: color.lightGrey, alignItems: 'center' })}>
      <p css={{ fontSize: 14, marginTop: 2 }}>{label}</p>
      {tooltip && (
        <Tooltip content={<p css={{ fontSize: 12 }}>{tooltip}</p>}>
          <Info size={16} />
        </Tooltip>
      )}
    </div>
    {children}
  </div>
)
