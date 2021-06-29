import { useEffect } from 'react';
import styled from 'styled-components'
import { Pill } from '@components'
import { useSet } from '@util/hooks'

const Filter = styled(
  ({
    value=[],
    options={},
    className,
    onChange=()=>{},
    ...rest
  }) => {

    const [selected, { add, remove, set }] = useSet()

    // fire onchange when tags change
    useEffect(() => onChange(Array.from(selected)), [selected.length]) // eslint-disable-line

    useEffect(() => set(value), [value])  // eslint-disable-line
    
    return <div
      className={`filter ${className}`}
      {...rest}
      >
      {Object.keys(options).map(key => 
        <Pill 
          key={key} 
          onClick={() => selected.includes(key) ? remove(key) : add(key)}
          data-active={selected.includes(key)}
          >
          {options[key]}
        </Pill>
      )}
    </div>
  })
  `
    display: block;

    >.pill{
      background: rgba(${({theme}) => theme.primary}, 0.2);
      color: rgb(${({theme}) => theme.primary});

      &:hover,
      &[data-active="true"],
      &[data-active="false"]:hover{
        background: rgb(${({theme}) => theme.primary});
        color: rgb(${({theme}) => theme.background});
      }

      & + .pill{
        margin-left: 0.4em;
      }
    }

    >.reset{
      margin-left: 1em
    }
  
  `

export default Filter