import React from 'react'
import styled from 'styled-components'

const NoResultsMessage = styled(
  ({
    title='Vamoosh',
    subtitle='Talisman cannot summon what you wish for.',
    text='Better luck next time.',
    className
  }) => 
    <div
      className={className}
      >
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <p>{text}</p>
    </div>
  )
  `
    display: block;
    padding: 2rem;
    text-align: center;
    width: 100%;
  `

const NoResults = 
  ({
    require,
    children
  }) => {
    // undefined not set? await children
    // require is explicitly set to false
    return (require === undefined && !React.Children.count(children)) || require === false 
        ? <NoResultsMessage/>
        : children
  }
  

export default NoResults