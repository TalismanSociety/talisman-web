import styled from '@emotion/styled'
import React, { ReactElement, useState } from 'react'

interface NavItemProps {
  className?: string
  selected?: boolean
}

export type NavItemType = {
  labelValue: string
  path: string
}

export type BottomBorderNavProps = {
  items: NavItemType[]
  children?: ReactElement | []
}

const BottomBorderNav = ({ items, children }: BottomBorderNavProps) => {
  const [selected, setSelected] = useState(0)

  const handleSelect = (index: number) => {
    setSelected(index)
  }

  return (
    <div>
      <Navbar>
        {items.map((item, index) => (
          <NavItem key={index} selected={index === selected} onClick={() => handleSelect(index)}>
            {item.labelValue}
          </NavItem>
        ))}
      </Navbar>
      <section
        css={{
          width: '100%',
        }}
      >
        {children}
      </section>
    </div>
  )
}

const Navbar = styled.section`
  display: flex;
  gap: 2.5rem;
  border-bottom: 1px solid #262626;
  margin-bottom: 2em;
`

// nav item but if selected prop then add border bottom
const NavItem = styled.div<NavItemProps>`
  cursor: pointer;
  color: ${props => (props.selected ? 'var(--color-primary)' : '#A5A5A5')};
  padding-bottom: 1rem;
  font-size: 18px;
  border-bottom: 1px solid ${props => (props.selected ? 'var(--color-primary)' : 'transparent')};
  transition: all 0.2s ease-in-out;
`

export default BottomBorderNav
