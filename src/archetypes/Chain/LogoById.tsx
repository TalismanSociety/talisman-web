import { Image } from '@components'
import styled from 'styled-components'

export default styled(({ id, className }) => {
  return (
    <Image
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
    border-radius: 50%;
    display: block;
  }
`