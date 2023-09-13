import AccountIcon from '@components/molecules/AccountIcon'
import type { Account } from '@domains/accounts'
import { useTheme } from '@emotion/react'
import { ChevronDown, Users } from '@talismn/icons'
import { IconButton, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { type ReactNode } from 'react'

export type AccountValueInfoProps = {
  account?: Account
  balance: ReactNode
}

const AccountValueInfo = ({ account, balance }: AccountValueInfoProps) => {
  const theme = useTheme()
  return (
    <section
      css={{
        'display': 'flex',
        'flexDirection': 'row',
        'borderRadius': '1.2rem',
        'width': 'fit-content',
        'padding': '1.6rem 2.4rem',
        'backgroundColor': theme.color.background,
        'cursor': 'pointer',
        ':hover': {
          backgroundColor: theme.color.surface,
        },
      }}
    >
      {account === undefined ? (
        <IconButton size="6.4rem" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
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
            {account === undefined ? 'All accounts' : account.name ?? shortenAddress(account.address)}
          </Text.Body>
          <ChevronDown />
        </div>
        <Text.H3 css={{ margin: '0', fontSize: '2em' }}>{balance}</Text.H3>
      </section>
    </section>
  )
}

export default AccountValueInfo
