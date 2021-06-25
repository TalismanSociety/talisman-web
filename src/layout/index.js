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
    //background: rgb(${({ theme }) => theme.background});
    //color: rgb(${({ theme }) => theme.foreground});
  `

export default Layout