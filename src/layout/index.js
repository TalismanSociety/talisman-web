import styled from '@emotion/styled'

import Content from './Content'
import Footer from './Footer'
import Header from './Header'
import RamenStudio from './RamenStudio'

const Layout = styled(({ children, className }) => (
  <div className={className}>
    <Header />
    <RamenStudio />
    <Content>{children}</Content>
    <Footer />
  </div>
))`
  display: grid;
  grid-template: max-content auto max-content / 1fr;
  height: 100%;
`

export default Layout
