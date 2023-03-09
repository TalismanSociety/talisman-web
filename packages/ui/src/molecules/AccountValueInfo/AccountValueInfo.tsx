import { Users } from '@talismn/icons'
import { ReactNode } from 'react'

import { Identicon, Text } from '../../atoms'

export type AccountValueInfoProps = {
  address: string
  name: string
  balance: ReactNode
}

const AccountValueInfo = ({ address, name, balance }: AccountValueInfoProps) => {
  return (
    <section
      css={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Identicon
        custom={!address ? <Users size="2.4rem" /> : undefined}
        value={address ?? ''}
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
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '1.25rem',
          justifyContent: 'space-evenly',
          alignItems: 'flex-start',
        }}
      >
        <Text.Body css={{ fontSize: '1em' }}>{name}</Text.Body>
        <Text.H3 css={{ margin: '0', fontSize: '2em' }}>{balance}</Text.H3>
      </section>
    </section>
  )
}

export default AccountValueInfo
