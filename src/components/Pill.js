import styled from 'styled-components'

const Pill = styled(
  ({
    children,
    className,
    small,
    large,
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
    background: rgb(${({ theme }) => theme?.background});
    color: rgb(${({ theme }) => theme?.foreground});
    box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.1);
    font-size: 1.1em;

    ${({onClick}) => !!onClick && `
      cursor: pointer;
    `}
    
    ${({small}) => small && `
      font-size: 0.85em;
      padding: 0.4rem 0.5em;
    `}

    ${({large}) => large && `
      font-size: 1.1em;
      padding: 1.6rem 1.2em;
    `}

    ${({primary, theme}) => !!primary && `
      background: rgba(${theme?.primary}, 0.2);
      color: rgb(${theme?.primary});
      box-shadow: none;
      &:hover{
        background: rgb(${theme?.primary});
        color: rgb(${theme?.background});
      }
    `}
  `

export default Pill