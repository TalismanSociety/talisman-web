import styled from 'styled-components'
import { Pill } from '@components'
import { useCrowdloanById } from '@libs/talisman'

const Links = styled(
  ({
    id,
    className
  }) => {
    const { links={} } = useCrowdloanById(id)

    return <div 
      className={`crowdloan-links ${className}`}
      >
      {Object.keys(links).map(name => 
        <Pill
          primary
          onClick={() =>  window.open(links[name], "_blank")}
          >
          {name}
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