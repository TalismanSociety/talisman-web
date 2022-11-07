import styled from '@emotion/styled'
import React from 'react'

const NoResultsMessage = styled(({ title, subtitle, text, className }) => (
  <div className={className}>
    {title && <h1>{title}</h1>}
    {subtitle && <h2>{subtitle}</h2>}
    {text && <p>{text}</p>}
  </div>
))`
  display: block;
  padding: 2rem;
  text-align: center;
  width: 100%;
`

const NoResults = ({ require, children, ...props }) => {
  // undefined not set? await children
  // require is explicitly set to false
  return (require === undefined && !React.Children.count(children)) || require === false ? (
    <NoResultsMessage {...props} />
  ) : (
    children
  )
}

export default NoResults
