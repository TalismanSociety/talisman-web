import type { Account } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import { Eye } from '@talismn/icons'
import { Badge, BadgedBox, Identicon, useSurfaceColorAtElevation, type IdenticonProps, Tooltip } from '@talismn/ui'

export type AccountIconProps = Omit<IdenticonProps, 'value'> & { account: Pick<Account, 'readonly' | 'address'> }

const AccountIcon = ({ account, ...props }: AccountIconProps) => {
  const theme = useTheme()
  const surfaceColor = useSurfaceColorAtElevation(x => x + 1)
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size ?? '2.4rem'

  return (
    <BadgedBox
      overlap="circular"
      badge={
        account.readonly && (
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
      <Identicon {...props} size={size} value={account.address} />
    </BadgedBox>
  )
}

export default AccountIcon
