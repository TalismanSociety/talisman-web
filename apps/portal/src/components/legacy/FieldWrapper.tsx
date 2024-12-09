import styled from '@emotion/styled'

// May want to figure out what prefix's and onClick actual type is
type FieldWrapperProps = {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prefix?: any
  suffix?: React.ReactNode
  className?: string
  children?: React.ReactNode
  label?: string
  dim?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any
}

export const FieldWrapper = styled(
  ({ type, prefix, suffix, label, dim, children, className, ...rest }: FieldWrapperProps) => (
    <div className={`field field-${type}${dim ? ' dim' : ''} ${className ?? ''}`} {...rest}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <span className="children">
        {!!prefix && <span className="prefix">{prefix}</span>}
        {children}
        {!!suffix && <span className="suffix">{suffix}</span>}
      </span>
    </div>
  )
)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);

  > .children {
    border: none;
    box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
    display: block;
    width: 100%;

    &:hover {
      box-shadow: 0 0 2rem rgba(0, 0, 0, 0.15);
    }

    .prefix,
    .suffix {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.4;
      pointer-events: none;
      > * {
        display: block;
        width: 1.5em;
        height: 1.5em;
      }
    }

    .prefix {
      left: 1em;
    }
    .suffix {
      right: 0.7em;
    }

    input,
    select {
      font-size: 1.2em;
      font-family: inherit;
      font-weight: inherit;
      border: none;
      padding: 1.1rem 1.5rem;
      width: 100%;
      ${({ prefix }) => !!prefix && `padding-left: 5rem;`}
      ${({ suffix }) => !!suffix && `padding-right: 2rem;`}
      &:hover {
        color: var(--color-text);
      }
      transition: all 0.2s ease-in-out;
    }

    select {
      cursor: pointer;
    }
  }

  &.dim {
    > .children {
      border-radius: 0.8rem;
      box-shadow: none;

      input,
      select {
        background: var(--color-controlBackground);
      }
    }
  }

  ::placeholder {
    color: var(--color-dim);
  }
`

type FieldLabelProps = {
  className?: string
  children?: string
}

export const FieldLabel = styled(({ children, className, ...rest }: FieldLabelProps) =>
  children ? (
    <label
      className={`field-label ${className ?? ''}`}
      {...rest}
      dangerouslySetInnerHTML={{ __html: children }}
    ></label>
  ) : null
)`
  position: relative;
  font-size: 0.6em;
  text-transform: uppercase;
  font-weight: var(--font-weight-bold);
  color: rgb(${({ theme }) => theme.mid});
  white-space: pre-line;
  text-align: right;
  line-height: 1.2em;
  opacity: 0.8;
`
