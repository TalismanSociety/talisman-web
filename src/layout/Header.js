import { ReactComponent as TalismanHandLogo } from '@assets/hand-red-black.svg'
import { ReactComponent as CrowdloansLogo } from '@assets/icons/crowdloans.svg'
import { ReactComponent as DiscordLogo } from '@assets/icons/discord-header.svg'
import { ReactComponent as DiscordMobileLogo } from '@assets/icons/discord-mobile.svg'
import { ReactComponent as GithubLogo } from '@assets/icons/github-header.svg'
import { ReactComponent as GithubMobileLogo } from '@assets/icons/github-mobile.svg'
import { ReactComponent as MediumLogo } from '@assets/icons/medium-header.svg'
import { ReactComponent as MediumMobileLogo } from '@assets/icons/medium-mobile.svg'
import { ReactComponent as PortfolioLogo } from '@assets/icons/portfolio.svg'
import { ReactComponent as SwapLogo } from '@assets/icons/swap.svg'
import { ReactComponent as TwitterLogo } from '@assets/icons/twitter-header.svg'
import { ReactComponent as TwitterMobileLogo } from '@assets/icons/twitter-mobile.svg'
import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import { useMediaQuery } from '@util/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducer } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export default function HeaderState(props) {
  const isMobile = useMediaQuery('(max-width: 700px)')
  const [mobileMenuOpen, dispatch] = useReducer((state = false, action) =>
    action === 'toggle' ? !state : action === 'open' ? true : action === 'close' ? false : state
  )

  return <Header {...props} isMobile={isMobile} mobileMenuOpen={mobileMenuOpen} dispatch={dispatch} />
}

const Header = styled(({ className, isMobile, mobileMenuOpen, dispatch }) => (
  <header className={className}>
    <span>
      <NavLink exact to="/" className="logo">
        {isMobile ? <TalismanHandLogo /> : <TalismanWordLogo />}
      </NavLink>
    </span>
    {isMobile ? (
      <>
        <button className="mobile-nav-button" onClick={() => dispatch('toggle')}>
          Menu
        </button>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch('close')}
            >
              <NavLink exact to="/">
                <span>Portfolio</span>
                <PortfolioLogo alt="Portfolio" />
              </NavLink>
              <NavLink to="/crowdloans">
                <span>Crowdloans</span>
                <CrowdloansLogo alt="Crowdloans" />
              </NavLink>
              <a
                href="https://talisman.canny.io/feature-requests"
                target="_blank"
                rel="noreferrer noopener"
                className="text-pill"
              >
                <span>Request Features</span>
                <SwapLogo alt="Request Features" />
              </a>
              <a href="https://github.com/talismansociety" target="_blank" rel="noreferrer noopener">
                <span>GitHub</span>
                <GithubMobileLogo alt="GitHub" />
              </a>
              <a href="https://discord.gg/rQgTD9SGtU" target="_blank" rel="noreferrer noopener">
                <span>Discord</span>
                <DiscordMobileLogo alt="Discord" />
              </a>
              <a href="https://twitter.com/wearetalisman" target="_blank" rel="noreferrer noopener">
                <span>Twitter</span>
                <TwitterMobileLogo alt="Twitter" />
              </a>
              <a href="https://medium.com/we-are-talisman" target="_blank" rel="noreferrer noopener">
                <span>Medium</span>
                <MediumMobileLogo alt="Medium" />
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </>
    ) : (
      <>
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
          <a href="https://twitter.com/wearetalisman" target="_blank" rel="noreferrer noopener">
            <TwitterLogo alt="Twitter" />
          </a>
          <a href="https://medium.com/we-are-talisman" target="_blank" rel="noreferrer noopener">
            <MediumLogo alt="Medium" />
          </a>
        </nav>
      </>
    )}
  </header>
))`
  display: grid;
  grid-template: 1fr / 1fr 1fr 1fr;
  padding: 0 2.4rem;
  width: 100%;
  box-shadow: 0 0 2.4rem rgba(0, 0, 0, 0.05);
  background: var(--color-controlBackground);

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
    display: block;
    font-size: 3.2rem;
    color: var(--color-text);

    svg {
      display: block;
      width: auto;
      height: 1em;
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

  .mobile-nav-button {
    border: none;
    align-self: center;
    padding: 1.2rem 2.4rem;
    margin: 1.6rem 0;
    line-height: 1em;
    cursor: pointer;
    color: rgb(${({ theme }) => theme?.text});
    background: rgb(${({ theme }) => theme?.activeBackground});
    border-radius: 9999999rem;
    transition: all 0.15s ease-in-out;
    box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.1);
  }
  .mobile-nav {
    display: grid;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: calc(100% + 1rem);
    right: 1rem;
    padding: 1rem 2rem;
    box-shadow: 0 0 0.8rem rgba(0, 0, 0, 0.1);
    border-radius: 1.6rem;
    background: var(--color-controlBackground);

    > a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;

      > svg {
        border-radius: 100px;
        background: var(--color-activeBackground);
        color: var(--color-primary);
        font-size: 2.4rem;
        margin-left: 5rem;
      }
    }
  }

  @media only screen and (max-width: 913px) {
    .external-nav > a.text-pill {
      display: none;
    }
  }

  @media only screen and (max-width: 700px) {
    grid-template: 1fr / 1fr 1fr;

    > * {
      display: flex;
      align-items: center;

      &:nth-child(3n + 1) {
        justify-self: start;
      }
      &:nth-child(3n + 2) {
        justify-self: end;
      }
    }

    .logo svg {
      height: 1.5em;
    }

    .account-button {
      font-size: 0.8em;
    }
  }
`
