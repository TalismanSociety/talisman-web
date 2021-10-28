import styled from 'styled-components'

import Content from './Content'
import Footer from './Footer'
import Header from './Header'

const Layout = styled(({ children, className }) => (
  <div className={className}>
    <Header />
    <Content>{children}</Content>
    <Footer />
  </div>
))`
  overflow-x: hidden;

  > * {
    position: relative;
    z-index: 1;
  }

  > header {
    z-index: 1000;
  }

  > main {
    z-index: 1;
  }

  > footer {
    z-index: 999;
  }
`

export default Layout
