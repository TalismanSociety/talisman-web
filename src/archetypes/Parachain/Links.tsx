import { Pill } from '@components'
import { trackGoal } from '@libs/fathom'
import { useParachainDetailsById } from '@libs/talisman'
import styled from 'styled-components'

const Links = styled(({ id, className }) => {
  const { parachainDetails: { links = {} } = {} } = useParachainDetailsById(id)

  return (
    <div className={`crowdloan-links ${className}`}>
      {Object.keys(links).map((name, index) => (
        <a
          key={index}
          href={links[name]}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => trackGoal('0Q0R42E0', 1)} // bounce_crowdloansocial
        >
          <Pill primary onClick={() => null}>
            {name}
          </Pill>
        </a>
      ))}
    </div>
  )
})`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`

export default Links
