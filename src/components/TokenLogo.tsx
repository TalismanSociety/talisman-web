import { Image } from '@components'
import { Token } from '@talismn/chaindata-provider'
import styled from 'styled-components'

type TokenLogoProps = {
  token: Token
  type: string
  size: number
  className?: string
}
export default styled(({ token, type, className }: TokenLogoProps) => {
  return (
    <Image
      src={token.logo}
      alt={`${token.symbol} ${type}`}
      className={`token-asset token-${type} ${className}`}
      data-type={type}
    />
  )
})`
  &[data-type='logo'] {
    font-size: ${({ size = 8 }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: block;
  }
`
