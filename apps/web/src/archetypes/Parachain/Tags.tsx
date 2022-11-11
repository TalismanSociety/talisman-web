import { Pill } from '@components'
import styled from '@emotion/styled'
import { useParachainDetailsById } from '@libs/talisman'

import { LinksProps } from './Links'

const Links = styled(({ id, className }: LinksProps) => {
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
