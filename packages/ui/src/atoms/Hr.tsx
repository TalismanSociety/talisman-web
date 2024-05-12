import { Text } from '.'
import { useTheme } from '@emotion/react'
import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'

type HrProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>>

const Hr = ({ children, ...props }: HrProps) => {
  const theme = useTheme()
  const baseStyle = {
    height: 0,
    border: 'none',
    borderBottom: `1px solid ${theme.color.outlineVariant}`,
  }

  if (!children) {
    return <hr {...props} css={baseStyle} />
  }

  return (
    <div {...props} css={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
      <div css={[baseStyle, { flex: 1 }]} />
      <Text.Body>{children}</Text.Body>
      <div css={[baseStyle, { flex: 1 }]} />
    </div>
  )
}

export default Hr
