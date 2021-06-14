import styled from 'styled-components'

type PropTypes = {
  className: React.ReactNode,
}

const Footer = styled(
  (
    {
      className
    }: PropTypes
  ) => 
    <footer
      className={className}
      >
      [footer]
    </footer>
  )
  `
    padding: 0.7em 1em;
    border-top: 1px solid ${({ theme }) => theme.invert};
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  `

export default Footer