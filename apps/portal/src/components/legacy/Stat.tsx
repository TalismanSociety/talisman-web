import styled from '@emotion/styled'
import { type PropsWithChildren, type ReactNode } from 'react'

const Pill = styled(
  ({ title, children, className, ...rest }: PropsWithChildren<{ title: ReactNode; className?: string }>) => (
    <span className={`stat ${className ?? ''}`} {...rest}>
      {!!title && <span className="title">{title}</span>}
      <span className="value">{children}</span>
    </span>
  )
)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: inherit;

  .title {
  }
`

export default Pill
