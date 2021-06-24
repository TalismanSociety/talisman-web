import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '@root/App.Theme'
import { Toggle } from '@components'
import { Account } from '@archetypes'

type Props = {
  className: React.ReactNode,
}

const Header = styled(
  (
    {
      className
    }: Props
  ) => {
    const { toggle } = useTheme()

    return <header
      className={className}
      >
      <span>
        <NavLink
          to='/'
          >
          <h1>Talisman</h1>
        </NavLink>
      </span>
      <span>
        <Account.Button/>
        <Toggle
          onChange={toggle}
        />
        <nav>
          <NavLink to='/showcase'>Showcase</NavLink>
        </nav>
      </span>
    </header>
  })
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.7em 1em;
    //border-bottom: 1px solid ${({ theme }) => theme.invert};

    //position: absolute;
    //top: 0;
    //left: 0;
    width: 100%;

    >span{
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:last-child{
        >*{
          margin-left: 1em;
        }
      }
    }

    h1{
      margin: 0;
      font-size: inherit;
      line-height: inherit;
    }

    nav{
      display: flex;
      justify-content: space-between;
      align-items: center;

      >*{
        margin-left: 1em;
      }
    }
  `

export default Header