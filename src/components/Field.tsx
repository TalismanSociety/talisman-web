import styled from 'styled-components'
import { ReactComponent as SearchIcon } from '@icons/search.svg'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'

const Field = styled(
  ({
    type,
    prefix,
    suffix,
    children,
    className
  }) => 
    <div
      className={`field field-${type} ${className}`}
      >
      {!!prefix && <span className="prefix">{prefix}</span>}
      {children}
      {!!suffix && <span className="suffix">{suffix}</span>}
    </div>
  )
  `
    position: relative;
    border: none;
    box-shadow: 0 0 1.2rem rgba(0, 0, 0, 0.1);
    border-radius: 2.2em;
    overflow: hidden;
    transition: box-shadow 0.2s ease;

    &:hover{
      box-shadow: 0 0 2rem rgba(0, 0, 0, 0.15);
    }

    .prefix,
    .suffix{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.4;
      pointer-events: none;
      >*{
        display: block;
        width: 1.5em;
        height: 1.5em;
      }
    }

    .prefix{
      left: 1.5em;
    }

    .suffix{
      right: 1.5em;
    }

    input,
    select{
      font-size: inherit;
      border: none;
      padding: 1.1rem 3rem;
      ${({prefix}) => !!prefix && `padding-left: 5.5rem;`}
      ${({suffix}) => !!suffix && `padding-right: 5.5rem;`}
    }

    select{
      cursor: pointer;
    }
  `

const Input = 
  ({
    value,
    className,
    onChange=()=>{},
    ...rest
  }) =>
    <Field
      type='input'
      className={className}
      >
      <input
        type="text"
        onChange={e => onChange(e?.target?.value)}
        {...rest}
      />
    </Field>

const Search =
  ({
    value,
    className,
    onChange=()=>{},
    ...rest
  }) =>
    <Field
      type='search'
      prefix={<SearchIcon/>}
      className={className}
      >
      <input
        type="text"
        onChange={e => onChange(e?.target?.value)}
        {...rest}
      />
    </Field>

const Select = styled(
  ({
    value,
    options,
    className,
    onChange=()=>{},
    ...rest
  }) =>
    <Field
      type='select'
      suffix={<ChevronDown/>}
      className={className}
      >
      <select
        onChange={e => onChange(e?.target?.value)}
        {...rest}
        >
        {options.map(({key, value}) =>
          <option 
            key={key}
            value={key}
            >
            {value}
          </option>
        )}
      </select>
    </Field>
  )
  `
    select{
      appearance: none;
      background-color: transparent;
      border: none;
    }
  `

Field.Input = Input
Field.Search = Search
Field.Select = Select

export default Field