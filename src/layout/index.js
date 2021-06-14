import styled from 'styled-components'
import Header from './Header'
import Content from './Content'
import Footer from './Footer'

type LayoutProps = {
  children: React.ReactNode,
  className: String,
}

const Layout = styled(
  (
    {
      children,
      className
    }: LayoutProps
  ) => 
    <div className={className}>
      <Header/>
      <Content>
        {children}
      </Content>
      <Footer/>
    </div>
  )
  `
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.invert};
  `

export default Layout