import styled from '@emotion/styled'
import Identicon from '@polkadot/react-identicon'

type IdenticonProps = Omit<Parameters<typeof Identicon['type']>[0], 'theme'>

export const Avatar = styled((props: IdenticonProps) => <Identicon {...props} theme="polkadot" />)`
  color: var(--color-primary);
  background: var(--color-activeBackground);
  border-radius: 999999999999rem;

  svg,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  img {
    border-radius: 999999999999rem;
  }
`
