import styled from '@emotion/styled'
import useOnClickOutside from '@util/useOnClickOutside'
import React, { useRef, useState } from 'react'

type MenuDropdownAlignment = 'left' | 'right'

export type MenuProps = {
  ButtonComponent: React.ReactElement
  children: React.ReactNode
  className?: string
  closeOnSelect?: boolean
  dropdownAlignment?: MenuDropdownAlignment
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MenuItem(props: any) {
  return (
    <li className="cursor-pointer" {...props}>
      {props.children}
    </li>
  )
}

export const Menu = styled((props: MenuProps) => {
  const { className = '', closeOnSelect = true } = props
  const nodeRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClickInside = (e: any) => {
    const el = nodeRef?.current
    if (closeOnSelect && el && el.contains(e.target as Node)) {
      setShowMenu(!showMenu)
    }
  }

  const onClickOutside = () => {
    setShowMenu(false)
  }

  useOnClickOutside(nodeRef, onClickOutside)

  return (
    <div ref={nodeRef} className={`relative inline-block ${className}`} onClick={onClickInside}>
      {React.cloneElement(props.ButtonComponent, {
        onClick: () => {
          const buttonProps = props.ButtonComponent.props
          if (buttonProps.onClick) {
            buttonProps.onClick()
          }
        },
      })}
      {showMenu && (
        <div className="menu-container">
          <div className="menu">{props.children}</div>
        </div>
      )}
    </div>
  )
})`
  position: relative;
  display: inline-block;

  .menu-container {
    position: relative;
  }

  .menu {
    background: var(--color-activeBackground);
    border-radius: 1rem;
    position: absolute;
    ${props => (props.dropdownAlignment === 'right' ? 'right' : 'left')}: 0px;
    ${props => (props.dropdownAlignment === 'right' ? `max-width: max-content;` : `max-width: 100%; width: 100%;`)}
    white-space: nowrap;
    margin-top: 1.5rem;
    z-index: 10;
    min-width: 256px;

    & ul {
      padding: 0;
      margin: 0;
    }

    & li {
      display: block;
      padding: 1rem 1.5rem;

      :hover {
        background: var(--color-controlBackground);
      }

      :first-child {
        border-radius: 1rem 1rem 0 0;
      }

      :last-child {
        border-radius: 0 0 1rem 1rem;
      }
    }
    & li > * {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      cursor: pointer;
    }
  }
`

export default Menu
