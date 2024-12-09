import type { IdenticonProps } from '@talismn/ui/atoms/Identicon'
import { useTheme } from '@emotion/react'
import { Badge, BadgedBox } from '@talismn/ui/atoms/Badge'
import { Identicon } from '@talismn/ui/atoms/Identicon'
import { useSurfaceColorAtElevation } from '@talismn/ui/atoms/Surface'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { Eye } from '@talismn/web-icons'

import type { Account } from '@/domains/accounts'

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
