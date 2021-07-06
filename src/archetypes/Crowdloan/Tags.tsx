import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloanById } from '@libs/talisman'

const Links = styled(
  ({
    id,
    className
  }) => {
    const { tags=[] } = useCrowdloanById(id)

    return <div 
      className={`crowdloan-links ${className}`}
      >
      {tags.map(tag => 
        <Pill
          primary
          small
          >
          {tag}
        </Pill>
      )}
    </div>
  })
  `
    display: block;
    >.pill + .pill{
      margin-left: 0.2em;
    }
  `

export default Links