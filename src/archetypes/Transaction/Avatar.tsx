import Identicon, { IdenticonProps } from '@components/atoms/Identicon'
import styled from '@emotion/styled'

type AvatarProps = IdenticonProps

export const Avatar = styled((props: AvatarProps) => <Identicon {...props} />)`
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
