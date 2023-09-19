import { Check } from '@talismn/icons'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: number
}

const Checkbox: React.FC<Props> = ({ checked, onChange, label, disabled, size = 16 }) => {
  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        css={({ color, backgroundLight }) => ({
          width: size,
          height: size,
          borderRadius: 4,
          border: `1px solid rgb(${backgroundLight})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? `rgb(${backgroundLight})` : undefined,
          svg: {
            color: color.primary,
          },
        })}
      >
        {checked && <Check size={14} />}
      </div>
      {!!label && (
        <p
          css={{
            fontSize: 14,
            color: 'var(--color-foreground)',
          }}
        >
          {label}
        </p>
      )}
    </div>
  )
}

export default Checkbox
