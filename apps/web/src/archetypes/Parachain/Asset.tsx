import { Image as Img } from '@components'
import styled from '@emotion/styled'
import { useParachainAssets, useParachainDetailsById } from '@libs/talisman'

type ImageProps = {
  id: string
  className?: string
  type: string
}

const Image = styled(({ id, type, className }: ImageProps) => {
  const assets = useParachainAssets(id)
  const { parachainDetails: { name } = {} } = useParachainDetailsById(parseInt(id))

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
    font-size: ${({ size = 8 }: { size?: number }) => `${size}rem`};
    width: 1em;
    height: 1em;
    border-radius: 50%;
    display: block;
  }
`

export default Image
