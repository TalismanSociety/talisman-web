import styled from '@emotion/styled'
import { useState } from 'react'

interface NavItemProps {
  className?: string
  selected?: boolean
}

export type NavItemType = {
  label: string
  url: string
}

export type BottomBorderNavProps = {
  items: NavItemType[]
}

const BottomBorderNav = ({ items }: BottomBorderNavProps) => {
  const [selected, setSelected] = useState(0)

  const handleSelect = (index: number) => {
    setSelected(index)
  }

  return (
    <Navbar>
      {items.map((item, index) => (
        <NavItem key={index} selected={index === selected} onClick={() => handleSelect(index)}>
          {item.label}
        </NavItem>
      ))}
    </Navbar>
  )
}

const Navbar = styled.section`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #262626;
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
