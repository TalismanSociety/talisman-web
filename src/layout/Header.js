import { ReactComponent as DiscordLogo } from '@assets/icons/discord-header.svg'
import { ReactComponent as GithubLogo } from '@assets/icons/github-header.svg'
import { ReactComponent as MediumLogo } from '@assets/icons/medium-header.svg'
import { ReactComponent as TwitterLogo } from '@assets/icons/twitter-header.svg'
import { ReactComponent as Logo } from '@assets/logo.svg'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Header = styled(({ className }) => (
  <header className={className}>
    <span>
      <NavLink exact to="/" className="logo">
        <Logo />
      </NavLink>
    </span>
    <nav className="main-nav">
      <NavLink exact to="/">
        Portfolio
      </NavLink>
      <NavLink to="/crowdloans">Crowdloans</NavLink>
    </nav>
    <nav className="external-nav">
      <a
        href="https://talisman.canny.io/feature-requests"
        target="_blank"
        rel="noreferrer noopener"
        className="text-pill"
      >
        Request Features
      </a>
      <a href="https://github.com/talismansociety" target="_blank" rel="noreferrer noopener">
        <GithubLogo alt="GitHub" />
      </a>
      <a href="https://discord.gg/rQgTD9SGtU" target="_blank" rel="noreferrer noopener">
        <DiscordLogo alt="Discord" />
      </a>
      <a href="https://medium.com/we-are-talisman" target="_blank" rel="noreferrer noopener">
        <MediumLogo alt="Medium" />
      </a>
      <a href="https://twitter.com/wearetalisman" target="_blank" rel="noreferrer noopener">
        <TwitterLogo alt="Twitter" />
      </a>
    </nav>
  </header>
))`
  display: grid;
  grid-template: 1fr / 1fr 1fr 1fr;
  padding: 0 2.4rem;
  width: 100%;
  box-shadow: 0 0 2.4rem rgba(0, 0, 0, 0.05);

  > * {
    display: flex;
    align-items: center;

    &:nth-child(3n + 1) {
      justify-self: start;
    }
    &:nth-child(3n + 2) {
      justify-self: center;
    }
    &:nth-child(3n + 3) {
      justify-self: end;
    }
  }

  .logo {
    display: inline-block;
    width: 22.7em;
    height: 1.8em;
    font-size: 1rem;
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > * {
      padding: 2.3rem 2.4rem;
      position: relative;

      &:after {
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

      &.active {
        color: var(--color-primary);
        &:after {
          width: 100%;
        }
      }
    }
  }

  .external-nav {
    > a {
      font-size: 2.4rem;
      color: var(--color-primary);

      &:hover {
        color: var(--color-foreground);
      }
      &:active {
        color: var(--color-primary);
      }
      &:not(:first-child) {
        margin-left: 1.5rem;
      }

      > svg {
        display: block;
      }
    }
    > a.text-pill {
      padding: 0.8rem 1.2rem;
      border-radius: 999999rem;
      line-height: 1.4rem;
      font-size: 1.4rem;
      font-weight: 500;
      color: rgb(${({ theme }) => theme?.background});
      background: var(--color-primary);
      text-align: center;

      &:hover {
        background: var(--color-foreground);
      }
      &:active {
        background: var(--color-primary);
      }
    }
  }

  @media only screen and (max-width: 913px) {
    .logo {
      font-size: 0.7rem;
    }
    .external-nav > a.text-pill {
      display: none;
    }
  }

  @media only screen and (max-width: 700px) {
    .logo {
      font-size: 0.4rem;
    }

    .account-button {
      font-size: 0.8em;
    }
  }
`

export default Header
