import styled from 'styled-components'

const Pill = styled(
  ({
    children,
    className,
    ...rest
  }) => 
    <span
      className={`pill ${className}`}
      {...rest}
      >
      {children}
    </span>
  )
  `
    transition: all 0.2s;
    //border: 1px solid black;
    line-height: 1em;
    padding: 0.4em 1em;
    display: inline-block;
    border-radius: 4rem;
    user-select: none;
    background: white;
    color: black;

    ${({onClick}) => !!onClick && `
      cursor: pointer;
    `}
    
    ${({small}) => small && `
      padding: 0.4rem 0.5em;
    `}
  `

export default Pill