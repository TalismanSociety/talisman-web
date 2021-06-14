import { useEffect } from 'react';
import styled from 'styled-components'
import { useBoolean } from '@util/hooks'


const Toggle = styled(
  ({
    value=false, 
    onChange=()=>{}, 
    className,
    ...rest
  }) => {
    let [ isActive, toggleActive ] = useBoolean(value)
    useEffect(() => onChange(isActive), [isActive]) // eslint-disable-line

    return <span
      className={`${className} toggle`}
      onClick={ toggleActive }
      data-active={isActive}
      {...rest}
      >
      <span className='toggle-indicator'/>
    </span>
  })`
    font-size: inherit;
    width: 2.2em;
    height: 1.2em;
    background: lightgrey;
    border-radius: 1.1em;
    position: relative;
    cursor: pointer;
    display: block;

    .toggle-indicator{
      height: 1em;
      width: 1em;
      display: block;
      position: absolute;
      top: 0.1em;
      left: 0.1em;
      transition: all 0.05s ease-out;
      border-radius: 1.5em;
      background: darkgrey;
      z-index: 2;
    }

    &[data-active="true"] {
      .toggle-indicator{
        top: 0.1em;
        left: calc(100% - 1em - 0.1em);
      }
    }
  `

export default Toggle