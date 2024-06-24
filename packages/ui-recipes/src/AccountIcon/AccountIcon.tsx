import { useTheme } from '@emotion/react'
import { Badge, BadgedBox, Identicon, Tooltip, useSurfaceColorAtElevation, type IdenticonProps } from '@talismn/ui'
import { Eye } from '@talismn/web-icons'

export type AccountIconProps = Omit<IdenticonProps, 'value'> & { address: string; readonly?: boolean }

const AccountIcon = ({ address, readonly, ...props }: AccountIconProps) => {
  const theme = useTheme()
  const surfaceColor = useSurfaceColorAtElevation(x => x + 1)
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size ?? '2.4rem'

  return (
    <BadgedBox
      overlap="circular"
      badge={
        readonly && (
          <Tooltip content="Watch only account">
            <Badge
              containerColor={surfaceColor}
              contentColor={theme.color.onSurface}
              css={{ fontSize: `calc(${size} / 3.5)` }}
            >
              <Eye />
            </Badge>
          </Tooltip>
        )
      }
    >
      <Identicon {...props} size={size} value={address} />
    </BadgedBox>
  )
}

export default AccountIcon
