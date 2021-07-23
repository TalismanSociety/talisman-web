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
      width: 22.7em;
      height: 1.8em;
      font-size: 1rem;
      svg{
        margin: 0;
        width: 100%;
        height: 100%
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

    @media only screen and (max-width: 700px) {
      .logo{
        font-size: 0.7rem;
      }

      .account-button{
        font-size: 0.8em;
      }
    };
  `

export default Header