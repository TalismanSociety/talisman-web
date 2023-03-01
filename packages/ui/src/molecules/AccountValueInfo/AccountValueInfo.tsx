import { Users } from '@talismn/icons'
import { ReactNode } from 'react'

import { Identicon, Text } from '../../atoms'
import DisplayValue from '../../atoms/DisplayValue/DisplayValue'

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
        css={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--color-primary)',
          backgroundColor: '#383838',
          borderRadius: '50%',
        }}
        custom={!address ? <Users width="2.4rem" height="2.4rem" /> : undefined}
        value={address ?? ''}
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
        <Text.H3 css={{ margin: '0', fontSize: '2em' }}>
          {typeof balance === 'number' ? <DisplayValue amount={balance} /> : balance}
        </Text.H3>
      </section>
    </section>
  )
}

export default AccountValueInfo
