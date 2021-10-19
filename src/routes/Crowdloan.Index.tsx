import { Crowdloan } from '@archetypes'
import styled from 'styled-components'

const CrowdloanIndex = styled(({ className }) => (
  <div className={className}>
    <Crowdloan.Index withFilter />
  </div>
))`
  width: 100%;
`

export default CrowdloanIndex
