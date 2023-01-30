import { ReactComponent as AllAccountsIcon } from '@assets/icons/all-accounts.svg'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'

import DisplayValue from '../../atoms/DisplayValue/DisplayValue'

export type AccountValueInfoProps = {
  address: string
  name: string
  balance: number
}

const AccountValueInfo = ({ address, name, balance }: any) => {
  return (
    <section
      css={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Identicon
        css={{
          color: 'var(--color-primary)',
          backgroundColor: '#383838',
          borderRadius: '50%',
        }}
        Custom={!address ? AllAccountsIcon : undefined}
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
          <DisplayValue amount={balance} />
        </Text.H3>
      </section>
    </section>
  )
}

export default AccountValueInfo
