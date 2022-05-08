import { Pill } from '@components'
import { useParachainDetailsById } from '@libs/talisman'
import styled from 'styled-components'

const Links = styled(({ id, className }) => {
  const { parachainDetails: { tags = [] } = {} } = useParachainDetailsById(id)

  return (
    <div className={`crowdloan-links ${className}`}>
      {tags.map(tag => (
        <Pill key={tag} primary small>
          {tag}
        </Pill>
      ))}
    </div>
  )
})`
  display: block;
  > .pill + .pill {
    margin-left: 0.2em;
  }
`

export default Links
