// import { Pill } from '@components'
import styled from '@emotion/styled'

import { LinksProps } from './Links'
// import { useParachainDetailsById } from '@libs/talisman'

const Links = styled(({ id, className }: LinksProps) => {
  // const { parachainDetails: { tags = [] } = {} } = useParachainDetailsById(id)

  return (
    <div className={`crowdloan-links ${className}`}>
      {/* {tags.map(tag => (
        <Pill key={tag} primary small>
          {tag}
        </Pill>
      ))} */}
    </div>
  )
})`
  display: block;
  > .pill + .pill {
    margin-left: 0.2em;
  }
`

export default Links
