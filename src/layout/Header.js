import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Account } from '@archetypes'
import { ReactComponent as Logo } from '@assets/logo.svg'

const Header = styled(
  (
    {
      className
    }
  ) => 
    <header
      className={className}
      >
      <span>
        <NavLink
          exact
          to='/'
          className='logo'
          >
          <Logo/>
        </NavLink>
      </span>
      <nav>
        <NavLink
          exact
          to='/'
          >
          Wallet
        </NavLink>
        <NavLink
          to='/crowdloans'
          >
          Crowdloans
        </NavLink>
      </nav>
      <span>
       
      </span>
    </header>
  )
  `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2.4rem;
    width: 100%;
    box-shadow: 0 0 2.4rem rgba(0, 0, 0, 0.05);

    >*{
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:first-child{
        width: 20%
      }

      &:last-child{
         width: 20%;
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
        padding: 2.3rem 2.4rem;
        position: relative;

        &:after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--color-primary);
          transition: width 0.15s ease-in-out;
        }

        &.active{
          color: var(--color-primary);
          &:after{
            width: 100%;
          }
        }
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