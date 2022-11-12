import styled from '@emotion/styled'

type PropTypes = {
  className?: string
}

const Footer = styled(({ className }: PropTypes) => <footer className={className}></footer>)`
  padding: 3rem 1em;
  display: block;
`

export default Footer
