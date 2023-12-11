import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'
import { Text } from '.'

type HrProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>>

const Hr = ({ children, ...props }: HrProps) => {
  const baseStyle = { opacity: 0.15, height: 0, border: 'none', borderBottom: '1px solid currentColor' }

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
