import { Image } from '@components'
import styled from '@emotion/styled'

type Props = {
  id?: string
  className?: string
  size?: number
}
export default styled(({ id, className }: Props) => {
  return (
    <Image
      className={`chain-logo ${className}`}
      src={`https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/${id}/logo.svg`}
      alt={`${id} logo`}
      data-type={'logo'}
    />
  )
})`
  &[data-type='logo'] {
    font-size: ${({ size = 8 }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 999999999999rem;
    display: block;
  }
`
