import { AlertCircle } from '@talismn/icons'

export const Alert: React.FC<React.PropsWithChildren> = ({ children }) => (
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
      svg: { color: color.primary },
    })}
  >
    <AlertCircle size={32} />
    {children}
  </div>
)
