import { useTheme } from '@emotion/react'
import { IconButton } from '@talismn/ui/atoms/IconButton'
import { Surface, useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { ChevronDown, Users } from '@talismn/web-icons'
import { type ReactNode } from 'react'

import type { Account } from '@/domains/accounts/recoils'
import { AccountIcon } from '@/components/molecules/AccountIcon'
import { truncateAddress } from '@/util/truncateAddress'

export type AccountValueInfoProps = {
  account?: Account
  balance: ReactNode
}

export const AccountValueInfo = ({ account, balance }: AccountValueInfoProps) => {
  const theme = useTheme()
  const surfaceColor = useSurfaceColor()
  return (
    <Surface
      css={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '1.2rem',
        width: 'fit-content',
        padding: '1.6rem 2.4rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: surfaceColor,
        },
      }}
    >
      {account === undefined ? (
        <IconButton size="6.4rem" containerColor={surfaceColor} contentColor={theme.color.primary}>
          <Users />
        </IconButton>
      ) : (
        <AccountIcon
          account={account}
          size="6.4rem"
          css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--color-primary)',
            backgroundColor: '#383838',
            borderRadius: '50%',
          }}
        />
      )}
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '1.25rem',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
        }}
      >
        <div
          css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.8rem', width: '100%' }}
        >
          <Text.Body css={{ fontSize: '1em' }}>
            {account === undefined ? 'My accounts' : account.name ?? truncateAddress(account.address)}
          </Text.Body>
          <ChevronDown />
        </div>
        <Text.H3
          css={{
            margin: '0',
            fontSize: '1.5em',
            '@media(min-width: 42rem)': {
              fontSize: '2em',
            },
          }}
        >
          {balance}
        </Text.H3>
      </section>
    </Surface>
  )
}
