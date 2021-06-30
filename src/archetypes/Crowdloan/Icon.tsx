import styled from 'styled-components'
import { useCrowdloanById } from '@libs/talisman'
import { useParachainAssetFullPath } from '@util/hooks'

const Icon = styled(
  ({
    id,
    className
  }) => {
    const { name, assets } = useCrowdloanById(id)

    const image = useParachainAssetFullPath(assets?.icon)   

    return <img 
      className={`parachain-icon ${className}`}
      src={image} 
      alt={name}
    />
  })
  `
    border: 1px solid white;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    display: inline-block;
  `

export default Icon