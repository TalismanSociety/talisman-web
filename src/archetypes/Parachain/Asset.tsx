import styled from 'styled-components'
import { Image as Img } from '@components'
import { useCrowdloanByParachainId, useParachainAssets } from '@libs/talisman'

const Image = styled(
  ({
    id,
    type,
    className
  }) => {
    const assets = useParachainAssets(id)
    const { name } = useCrowdloanByParachainId(id)

    return <Img 
      src={assets[type]} 
      alt={`${name} ${type}`}
      className={`crowdloan-asset crowdloan-${type} ${className}`}
      data-type={type}
    />
  })
  `
    &[data-type='logo']{
      font-size: ${({size=8}) => `${size}rem`};
      width: 1em;
      height: 1em;
      border-radius: 50%;
      display: block;
    }
  `

export default Image