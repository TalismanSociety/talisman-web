import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { useTheme } from '@emotion/react'

import { Text } from './Text'

type HrProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>>

export const Hr = ({ children, ...props }: HrProps) => {
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
