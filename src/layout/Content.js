import styled from 'styled-components'

const Content = styled(({ children, className }) => <main className={className}>{children}</main>)`
  display: flex;
  min-height: 100%;
`

export default Content
