import styled from '@emotion/styled'
import type { PropsWithChildren } from 'react'

export type InfoProps = PropsWithChildren<{
  className?: string
  text: string
}>

const Info = styled(({ text, children, className }: InfoProps) => (
  <div className={`popup ${className ?? ''}`}>
    <div className="trigger">{children}</div>
    <div className="content" dangerouslySetInnerHTML={{ __html: text }} />
  </div>
))`
  position: relative;
  font-weight: var(--font-weight-regular);

  .trigger {
    display: block;
    cursor: pointer;
    > * {
      display: block;
    }
  }

  .content {
    display: none;
    position: absolute;
    top: calc(100% + 0.5em);
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    background: var(--color-controlBackground);
    border: 1px solid var(--color-activeBackground);
    padding: var(--padding-small);
    border-radius: var(--border-radius);
    width: 100%;
    min-width: 24rem;
  }

  &:hover {
    > .content {
      display: block;
    }
  }
`

export default Info
