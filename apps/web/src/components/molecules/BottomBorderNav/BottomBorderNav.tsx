import styled from '@emotion/styled'
import { ReactElement } from 'react'

const Navbar = styled.section`
  display: flex;
  border-bottom: 1px solid #262626;
`

interface NavItemProps {
  className?: string
  selected?: boolean
  children?: ReactElement | ReactElement[]
}

const NavItem = (props: NavItemProps) => (
  <div
    css={{
      'cursor': 'pointer',
      'color': props.selected ? 'var(--color-primary)' : '#A5A5A5',
      'fontSize': '18px',
      'borderBottom': `1px solid ${props.selected ? 'var(--color-primary)' : 'transparent'}`,
      'transition': 'all 0.25s ease-in-out',
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      '> *': {
        padding: '1.5rem 1rem',
      },
      // hover
      ':hover': {
        color: props.selected ? 'var(--color-primary)' : 'var(--color-text)',
      },
    }}
  >
    {props.children}
  </div>
)

// nav item but if selected prop then add border bottom
// const NavItem = styled.div<NavItemProps>`

// `

export type BottomBorderNavProps = {
  children?: ReactElement | ReactElement[]
}

const BottomBorderNav = Object.assign(
  ({ children }: BottomBorderNavProps) => {
    return (
      <div>
        <Navbar>{children}</Navbar>
        <section
          css={{
            width: '100%',
          }}
        ></section>
      </div>
    )
  },
  { Item: NavItem }
)

export default BottomBorderNav
