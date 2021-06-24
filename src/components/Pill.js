import styled from 'styled-components'

const Pill = styled(
  ({
    active,
    children,
    className
  }) => 
    <span
      className={`pill ${className}`}
      data-active={active}
      >
      {children}
    </span>
  )
  `
    font-family: EverettMono, sans-serif;
    font-size: var(--font-size-xsmall);
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid white;
    line-height: 1em;
    padding: 0.8rem 1.1em;
    display: inline-block;
    border-radius: 4rem;
    user-select: none;
    
    ${({small}) => small && `
      padding: 0.4rem 0.5em;
    `}
  `

export default Pill