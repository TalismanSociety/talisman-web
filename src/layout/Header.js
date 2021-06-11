import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
//import { useTheme } from '@root/App.Theme'
import { Account } from '@archetypes'
import { ReactComponent as Logo } from '@assets/logo.svg'

type Props = {
  className: React.ReactNode,
}

const Header = styled(
  (
    {
      className
    }: Props
  ) => {
    //const { set } = useTheme()

    return <header
      className={className}
      >
      <span>
        <NavLink
          to='/'
          className='logo'
          >
          <Logo/>
        </NavLink>
      </span>
      <span>
        {/*<Toggle
          off='🌞'
          on='🌜'
          onChange={on => set(!!on ? 'dark' : 'light')}
        />*/}
        {/*<nav>
          <NavLink 
            to='/showcase'
            >
            Showcase
          </NavLink>
        </nav>*/}
        <Account.Button/>
      </span>
    </header>
  })
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 2.4rem;
    width: 100%;
    height: 7.2rem;

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

    .logo{
      display: inline-block;
      width: 22.7rem;
      height: 1.8rem;
      svg{
        margin: 0;
        width: 22.7rem;
        height: 1.8rem;
      }
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