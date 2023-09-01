import { ReactComponent as IconClear } from '@assets/icons/x-circle.svg'
import { Pill } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { ReactComponent as SearchIcon } from '@icons/search.svg'
import { useBoolean } from '@util/hooks'
import { useEffect } from 'react'

// framework

type FieldLabelProps = {
  className?: string
  children?: string
}

const FieldLabel = styled(({ children, className, ...rest }: FieldLabelProps) =>
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

// May want to figure out what prefix's and onClick actual type is
type FieldWrapperProps = {
  type: string
  prefix?: any
  suffix?: React.ReactNode
  className?: string
  children?: React.ReactNode
  label?: string
  dim?: boolean
  onClick?: any
}

const FieldWrapper = styled(({ type, prefix, suffix, label, dim, children, className, ...rest }: FieldWrapperProps) => (
  <div className={`field field-${type}${dim ? ' dim' : ''} ${className ?? ''}`} {...rest}>
    {label && <FieldLabel>{label}</FieldLabel>}
    <span className="children">
      {!!prefix && <span className="prefix">{prefix}</span>}
      {children}
      {!!suffix && <span className="suffix">{suffix}</span>}
    </span>
  </div>
))`
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

  // Where is this accessed from?
  ${({ inline }: any) =>
    Boolean(inline) &&
    `
      flex-direction: row;
      label{
        margin-right: 0.4em;
      }
    `};

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

// field types
type InputProps = {
  className?: string
  onChange?: (e: any) => void
  type?: string
  inputMode?: string
  pattern?: string
  prefix?: any
  suffix?: React.ReactNode
  label?: string
  dim?: boolean
  value?: any
  placeholder?: string
  disabled?: boolean
}

export const Input = styled(({ className, onChange = _v => {}, prefix, suffix, label, dim, ...rest }: InputProps) => (
  <FieldWrapper type="input" className={className} prefix={prefix} suffix={suffix} label={label} dim={dim}>
    <input type="text" onChange={e => onChange(e?.target?.value)} {...(rest as any)} />
  </FieldWrapper>
))``

type SearchProps = {
  className?: string
  value?: string
  onChange?: (e: any) => void
  placeholder?: string
}

export const Search = styled(({ value, className, onChange = () => {}, ...rest }: SearchProps) => (
  <FieldWrapper
    type="search"
    prefix={<SearchIcon />}
    suffix={<IconClear data-display={value !== ''} onClick={() => onChange('')} />}
    className={className}
  >
    <input type="text" onChange={e => onChange(e?.target?.value)} value={value} {...rest} />
  </FieldWrapper>
))`
  .children {
    [type='text'] {
      background: var(--color-controlBackground);
    }
    .suffix {
      svg {
        transform: translatex(50%);
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        cursor: pointer;
        &[data-display='true'] {
          opacity: 0.4;
          pointer-events: all;
          transform: translatex(0);
        }
      }
    }
  }
`

type SelectProps = {
  value?: string
  options?: any
  className?: string
  suffix?: boolean
  onChange: (value: string) => void
}

export const Select = styled(
  ({ value, options, className, suffix = true, onChange = (_v: string) => {}, ...rest }: SelectProps) => (
    <FieldWrapper type="select" suffix={suffix ? <ChevronDown /> : null} className={className}>
      <select onChange={e => onChange(e?.target?.value)} {...rest}>
        {options.map(({ key, value }: { key: string; value: string }) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
)`
  select {
    appearance: none;
    background-color: var(--color-controlBackground);
    border: none;
  }
`

type ToggleProps = {
  value?: boolean
  className?: string
  onChange?: (value: any) => void
}

export const Toggle = styled(({ value = false, className, onChange = (_value: any) => {}, ...rest }: ToggleProps) => {
  const [isActive, toggleActive] = useBoolean(value)

  useEffect(() => onChange(isActive), [isActive, onChange])

  return (
    <FieldWrapper type="toggle" className={className} onClick={toggleActive} data-on={isActive} {...rest}>
      <div className="toggle" />
    </FieldWrapper>
  )
})`
  position: relative;
  cursor: pointer;
  overflow: visible;

  .children {
    overflow: visible;
    margin: 0.2em;
  }

  .toggle {
    width: 3em;
    height: 1.6em;
    position: relative;
    overflow: visible;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: -0.2em;
      transform: translateY(-50%);
      width: 2em;
      height: 2em;
      background: rgb(220, 220, 220);
      display: inline-block;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
  }

  &[data-on='true'] {
    .toggle:after {
      background: rgb(200, 200, 200);
      left: calc(100% - 1.8em);
    }
  }
`

type RadioGroupProps = {
  value: string
  options?: any
  className?: string
  onChange?: (value: string) => void
  small?: boolean
  primary?: boolean
  secondary?: boolean
}

export const RadioGroup = styled(
  ({ value, options = {}, onChange = () => {}, small, primary, secondary, className }: RadioGroupProps) => (
    <FieldWrapper type="radiogroup" className={className}>
      {options.map((option: Record<string, any>) => (
        <Pill
          key={option?.['key']}
          onClick={() => onChange(option?.['key'])}
          active={option?.['key'] === value}
          small={small}
          primary={primary}
          secondary={secondary}
        >
          {option?.['value']}
        </Pill>
      ))}
    </FieldWrapper>
  )
)`
  .children {
    display: flex;
    gap: 0.25rem;
    box-shadow: none;
    overflow: visible;
    &:hover {
      box-shadow: none;
    }

    background: var(--color-controlBackground);
    padding: 0.25rem;
    border-radius: 1.5rem;
  }
`
