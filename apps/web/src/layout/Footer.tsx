import styled from '@emotion/styled'

const Footer = styled(({ className }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <footer className={className}></footer>
))`
  padding: 3rem 1em;
  display: block;
`

export default Footer
