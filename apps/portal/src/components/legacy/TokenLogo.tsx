import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { type Token } from '@talismn/chaindata-provider'

type Props = {
  token: Pick<Token, 'symbol' | 'logo'>
  size?: number
  className?: string
}
export default styled(({ className, token }: Props) => (
  <img className={`token-logo ${className ?? ''}`} src={token.logo} alt={`${token.symbol} token logo`} />
))`
  display: block;
  width: 1em;
  height: 1em;

  ${({ size }) =>
    typeof size === 'number' &&
    css`
      font-size: ${size}rem;
    `}
`
