import styled from 'styled-components'

const Pill = styled(
  ({
    children,
    className,
    small,
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
    line-height: 1em;
    padding: 0.4em 1em;
    display: inline-block;
    border-radius: 4rem;
    user-select: none;
    background: white;
    color: black;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);

    ${({onClick}) => !!onClick && `
      cursor: pointer;
    `}
    
    ${({small}) => small && `
      font-size: 0.85em;
      padding: 0.4rem 0.5em;
    `}
  `

export default Pill