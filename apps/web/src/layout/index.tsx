import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

import Content from './Content'
import Footer from './Footer'
import Header from './Header'

const Layout = styled(({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={className}>
    <Header />
    <Content>{children}</Content>
    <Footer />
  </div>
))`
  display: grid;
  grid-template: max-content auto max-content / 1fr;
  height: 100%;
`

export default Layout
