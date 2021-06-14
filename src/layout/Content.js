import styled from 'styled-components'

type ContentProps = {
  children: React.ReactNode,
  className: React.ReactNode,
}

const Content = styled(
  (
    {
      children,
      className
    }: ContentProps
  ) => 
    <main
      className={className}
      >
      {children}
    </main>
  )
  `
    display: block;
    padding: 4em 1em;
    min-height: 100vh;
  `

export default Content