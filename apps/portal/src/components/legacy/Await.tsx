import styled from '@emotion/styled'

import Loader from '@/assets/icons/loader.svg?react'

const StyledLoader = styled(({ className }: { className?: string }) => (
  <div className={`await ${className ?? ''}`}>
    <Loader />
  </div>
))`
  display: block;
  padding: 2rem;
  width: 100%;
  text-align: center;
  font-size: inherit;
  > svg {
    font-size: inherit;
  }
`

/** @deprecated */
export const Await = ({ until = true, children }: { until: boolean; children: React.ReactNode }) =>
  until ? <>{children}</> : <StyledLoader />
