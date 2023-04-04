import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { type ReactElement, type ReactNode } from 'react'

const Navbar = styled.section`
  display: flex;
  border-bottom: 1px solid #262626;
`

type NavItemProps = {
  className?: string
  selected?: boolean
  children?: ReactNode
}

const NavItem = (props: NavItemProps) => {
  const theme = useTheme()

  return (
    <div
      className={props.className}
      css={{
        'cursor': 'pointer',
        'color': props.selected ? theme.color.primary : '#A5A5A5',
        'fontSize': '18px',
        'borderBottom': `1px solid ${props.selected ? theme.color.primary : 'transparent'}`,
        'transition': 'all 0.25s ease-in-out',
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        '> *': {
          padding: '1.5rem 1rem',
        },
        // hover
        ':hover': {
          color: props.selected ? theme.color.primary : undefined,
        },
      }}
    >
      {props.children}
    </div>
  )
}

// nav item but if selected prop then add border bottom
// const NavItem = styled.div<NavItemProps>`

// `

export type BottomBorderNavProps = {
  className?: string
  children?: ReactElement | ReactElement[]
}

const BottomBorderNav = Object.assign(
  ({ children, ...props }: BottomBorderNavProps) => {
    return (
      <div {...props}>
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
