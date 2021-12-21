import styled from 'styled-components'

export const Section = styled(({ className, children }) => {
  return <div className={className}>{children}</div>
})`
  background-color: #262626;
  padding: 2.4rem;
  border-radius: 1.2rem;
  font-family: 'SurtExpanded';
  height: 100%;

  > ul {
    padding-left: inherit;
  }
`
