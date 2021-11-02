import styled from 'styled-components'

const Pill = styled(({ children, className, small, large, primary, secondary, active, ...rest }) => (
  <span className={`pill ${className}`} {...rest}>
    {children}
  </span>
))`
  transition: all 0.2s;
  line-height: 1em;
  padding: 0.6em 1.2em;
  display: inline-flex;
  align-items: center;
  border-radius: 4rem;
  user-select: none;
  background: rgb(${({ theme }) => theme?.background});
  color: rgb(${({ theme }) => theme?.foreground});
  box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.1);
  font-size: 1em;

  * {
    line-height: 1em;
  }

  ${({ onClick }) =>
    !!onClick &&
    `
      cursor: pointer;
    `}

  ${({ small }) =>
    small &&
    `
      font-size: 0.85em;
      padding: 0.6em 0.9em;
    `}

    ${({ large }) =>
    large &&
    `
      font-size: 1.1em;
      padding: 0.6em 1.4em;
    `}

    ${({ primary, theme, onClick }) =>
    !!primary &&
    `
      background: var(--color-controlBackground);
      color: var(--color-foreground);
      box-shadow: none;
      ${
        !!onClick &&
        `
        &:hover{
          background: var(--color-activeBackground);
          color: var(--color-text);
        }
      `
      }
    `}

    ${({ secondary, onClick }) =>
    !!secondary &&
    `
      background: var(--color-controlBackground);
      color: var(--color-foreground);
      box-shadow: none;
      ${
        !!onClick &&
        `
        &:hover{
          background: var(--color-background);
          color: var(--color-text);
        }
      `
      }
    `}

    ${({ active, secondary, theme }) =>
    !!active &&
    `
      background: ${secondary ? `var(--color-activeBackground)` : `rgb(${theme?.primary})`};
      color: ${secondary ? `var(--color-text)` : `rgb(${theme?.background})`};
      box-shadow: none;
    `}
`

export default Pill
