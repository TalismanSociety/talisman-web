import styled from '@emotion/styled'
import { useBoolean } from '@util/hooks'
import { useEffect } from 'react'

export type ToggleProps = {
  className?: string
  value: boolean
  onChange: (active: boolean) => void
  off: boolean
  on: boolean
}

const Toggle = styled(({ value = false, onChange = () => {}, off, on, className, ...rest }: ToggleProps) => {
  const [isActive, toggleActive] = useBoolean(value)
  useEffect(() => onChange(isActive), [isActive]) // eslint-disable-line

  return (
    <span className={`${className ?? ''} toggle`} onClick={toggleActive} data-active={isActive} {...rest}>
      <span className="toggle-indicator" />
    </span>
  )
})`
  font-size: inherit;
  width: 2.2em;
  height: 1.2em;
  background: lightgrey;
  border-radius: 1.1em;
  position: relative;
  cursor: pointer;
  display: block;

  .toggle-indicator {
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

  &[data-active='true'] {
    .toggle-indicator {
      top: 0.1em;
      left: calc(100% - 1em - 0.1em);
    }
  }

  &:before,
  &:after {
    position: absolute;
    top: 50%;
    font-size: 0.7em;
    transform: translateY(-50%);
  }

  &:before {
    content: '${({ on }) => on}';
    left: 0.2rem;
  }

  &:after {
    content: '${({ off }) => off}';
    right: 0.2rem;
  }
`

export default Toggle
