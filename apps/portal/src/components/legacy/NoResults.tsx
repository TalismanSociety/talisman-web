import type { PropsWithChildren } from 'react'
import styled from '@emotion/styled'
import React from 'react'

type NoResultsMessageProps = {
  className?: string
  subtitle: string
  text: string
}

const NoResultsMessage = styled(({ subtitle, text, className }: NoResultsMessageProps) => (
  <div className={className}>
    {subtitle && <h2>{subtitle}</h2>}
    {text && <p>{text}</p>}
  </div>
))`
  display: block;
  padding: 2rem;
  text-align: center;
  width: 100%;
`

/** @deprecated */
export type NoResultProps = PropsWithChildren<{
  require: boolean
}> &
  NoResultsMessageProps

/** @deprecated */
export const NoResults = ({ require, children, ...props }: NoResultProps) => {
  // undefined not set? await children
  // require is explicitly set to false
  return (require === undefined && !React.Children.count(children)) || !require ? (
    <NoResultsMessage {...props} />
  ) : (
    <>{children}</>
  )
}
