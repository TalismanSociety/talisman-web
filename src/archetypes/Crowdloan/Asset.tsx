import styled from 'styled-components'
import { Image as Img } from '@components'
import { useCrowdloanById, useCrowdloanAssets } from '@libs/talisman'

const Image = styled(
  ({
    id,
    type,
    className
  }) => {
    const assets = useCrowdloanAssets(id)
    const { name } = useCrowdloanById(id)

    return <Img 
      src={assets[type]} 
      alt={`${name} ${type}`}
      className={`crowdloan-asset crowdloan-${type} ${className}`}
      data-type={type}
    />
  })
  `
    &[data-type='logo']{
      width: 8rem;
      height: 8rem;
      border: 1px solid white;
      border-radius: 50%;
      display: block;
    }
  `

export default Image