import { Image as Img } from '@components'
import { useParachainAssets, useParachainDetailsById } from '@libs/talisman'
import styled from 'styled-components'

const Image = styled(({ id, type, className }) => {
  const assets = useParachainAssets(id)
  const { parachainDetails: { name } = {} } = useParachainDetailsById(id)

  return (
    <Img
      src={assets[type]}
      alt={`${name} ${type}`}
      className={`crowdloan-asset crowdloan-${type} ${className}`}
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

export default Image
