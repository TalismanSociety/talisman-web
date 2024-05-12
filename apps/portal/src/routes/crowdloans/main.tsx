import { Crowdloan } from '../../components/legacy/archetypes'
import styled from '@emotion/styled'

export const CrowdloanIndex = styled(({ className }: { className?: string }) => (
  <div className={className}>
    <Crowdloan.Index withFilter />
  </div>
))`
  margin: 0 auto;
`
