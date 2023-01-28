import { LanguageSelector } from '@archetypes/LanguageSelector'
import { ReactComponent as TalismanHandLogo } from '@assets/hand-red-black.svg'
import { ReactComponent as CrowdloansLogo } from '@assets/icons/crowdloans.svg'
import { ReactComponent as DiscordMobileLogo } from '@assets/icons/discord-mobile.svg'
import { ReactComponent as GithubMobileLogo } from '@assets/icons/github-mobile.svg'
import { ReactComponent as MediumMobileLogo } from '@assets/icons/medium-mobile.svg'
import { ReactComponent as MoreHorizontal } from '@assets/icons/more-horizontal.svg'
import { ReactComponent as PortfolioLogo } from '@assets/icons/portfolio.svg'
import { ReactComponent as SwapLogo } from '@assets/icons/swap.svg'
import { ReactComponent as TwitterMobileLogo } from '@assets/icons/twitter-mobile.svg'
import { Button } from '@components'
import Menu from '@components/Menu'
import { WalletNavConnector } from '@components/WalletNavConnector'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { trackGoal } from '@libs/fathom'
import { useExtension } from '@libs/talisman'
import { useMediaQuery } from '@util/hooks'
import { DISCORD_JOIN_URL, TALISMAN_TWITTER_URL } from '@util/links'
import Color from 'colorjs.io'
import { AnimatePresence, motion, useAnimationControls, useScroll } from 'framer-motion'
import { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export default function HeaderState(props: any) {
  const isMobile = useMediaQuery('(max-width: 700px)')
  const [mobileMenuOpen, dispatch] = useReducer(
    (state = false, action: 'toggle' | 'open' | 'close') =>
      action === 'toggle' ? !state : action === 'open' ? true : action === 'close' ? false : state,
    undefined
  )

  return <Header {...props} isMobile={isMobile} mobileMenuOpen={mobileMenuOpen} dispatch={dispatch} />
}

const desktopRoutes = [
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'NFTs', path: '/nfts' },
  { name: 'Explore', path: '/explore' },
  { name: 'Crowdloans', path: '/crowdloans' },
  { name: 'Staking', path: '/staking' },
  { name: 'Transaction History', path: '/history' },
]

const mainRoutes = [
  { name: 'Portfolio', url: '/portfolio', icon: <PortfolioLogo title="Portfolio" /> },
  {
    name: 'Crowdloans',
    url: '/crowdloans',
    icon: <CrowdloansLogo title="Crowdloans" />,
  },
  {
    name: '🗝 Spirit keys',
    url: '/spiritkeys',
    icon: <CrowdloansLogo title="Spiritkeys" />,
  },
  { name: 'NFTs', url: '/nfts', icon: <PortfolioLogo title="NFTs" /> },
  { name: 'Transaction History', url: '/history', icon: <PortfolioLogo title="NFTs" /> },
]

const subRoutes = [
  {
    name: 'Request Features',
    url: 'https://talisman.upvoty.com/b/feature-requests/',
    trackingCode: 'RMSKIY4Q', // bounce_feature_requests
    icon: <SwapLogo title="Request Features" />,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/talismansociety',
    trackingCode: 'CG0L6VIJ', // bounce_github
    icon: <GithubMobileLogo title="GitHub" />,
  },
  {
    name: 'Discord',
    url: DISCORD_JOIN_URL,
    trackingCode: '00L5TXCI', // bounce_discord
    icon: <DiscordMobileLogo title="Discord" />,
  },
  {
    name: 'Twitter',
    url: TALISMAN_TWITTER_URL,
    trackingCode: 'NMVPOOER', // bounce_twitter
    icon: <TwitterMobileLogo title="Twitter" />,
  },
  {
    name: 'Medium',
    url: 'https://medium.com/we-are-talisman',
    trackingCode: 'Y1JQOEBW', // bounce_medium
    icon: <MediumMobileLogo title="Medium" />,
  },
]

const smolLinks = [
  {
    name: 'Terms of use',
    url: 'https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use',
  },
  {
    name: 'Privacy policy',
    url: 'https://docs.talisman.xyz/talisman/legal-and-security/privacy-policy',
  },
]

type HeaderProps = {
  className?: string
  isMobile: boolean
}

const Header = styled(({ className, isMobile }: HeaderProps) => {
  const theme = useTheme()

  const controls = useAnimationControls()
  const { scrollY } = useScroll()

  useEffect(() => {
    scrollY.onChange(y => {
      controls.start(y > 30 ? 'scrolled' : 'initial')
    })
  }, [controls, scrollY])

  const { t } = useTranslation('nav')
  const { status: extensionStatus } = useExtension()
  const homeRoute = ['LOADING', 'DISCONNECTED'].includes(extensionStatus) ? '/' : '/portfolio'

  const background = new Color(theme.color.background)
  background.alpha = 0.5

  return (
    <motion.header
      className={className}
      animate={controls}
      variants={{
        initial: {
          backdropFilter: 'blur(0)',
          boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 0px 0px inset',
        },
        scrolled: {
          backdropFilter: 'blur(12px)',
          boxShadow: 'rgba(255, 255, 255, 0.1) 0px -1px 0px 0px inset',
        },
      }}
      style={{
        backgroundColor: background.display(),
      }}
    >
      <span>
        <NavLink end to={homeRoute} className="logo">
          <TalismanHandLogo />
        </NavLink>
      </span>
      {!isMobile && (
        <nav css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          {desktopRoutes.map(route => (
            <NavLink
              to={route.path}
              css={{
                'padding': '0.75rem 1rem',
                'position': 'relative',
                'whiteSpace': 'nowrap',
                '&.active': { color: theme.color.onForegroundVariant },
                ':hover': { color: theme.color.onForegroundVariant },
              }}
            >
              {({ isActive }) => (
                <>
                  {t(route.name)}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        css={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '1rem',
                          background: theme.color.foregroundVariant,
                          zIndex: -1,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="menu-nav">
        <WalletNavConnector />
        <Button
          className="button-buy"
          small
          onClick={() => window.open('https://talisman.banxa.com/', '_blank', 'noopener,noreferrer')}
        >
          {t('Buy')}
        </Button>
        <LanguageSelector />
        <Menu
          dropdownAlignment="right"
          ButtonComponent={
            <button className="mobile-nav-button">
              <MoreHorizontal />
            </button>
          }
        >
          <AnimatePresence>
            <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ul>
                {isMobile &&
                  mainRoutes.map(route => {
                    return (
                      <li key={route.name}>
                        <NavLink to={route.url}>
                          <span>{t(route.name)}</span>
                          {route.icon}
                        </NavLink>
                      </li>
                    )
                  })}
                {subRoutes.map(route => {
                  return (
                    <li key={route.name}>
                      <a
                        href={route.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={route.trackingCode ? () => trackGoal(route.trackingCode, 1) : undefined}
                      >
                        <span>{t(route.name)}</span>
                        {route.icon}
                      </a>
                    </li>
                  )
                })}
                <div className="smol-links">
                  {smolLinks.map(route => {
                    return (
                      <a key={route.name} href={route.url} target="_blank" rel="noreferrer noopener">
                        <span>{t(route.name)}</span>
                      </a>
                    )
                  })}
                </div>
              </ul>
            </motion.nav>
          </AnimatePresence>
        </Menu>
      </div>
    </motion.header>
  )
})`
  position: sticky;
  top: 0;
  z-index: 10; /* just to be safe */
  display: grid;
  grid-template: 1fr / auto 0fr 2fr;
  max-height: 64px;

  padding: 0 2.4rem;
  width: 100%;
  box-shadow: 0 0 2.4rem rgba(0, 0, 0, 0.05);
  background: var(--color-background);

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
    margin-right: 3rem;

    svg {
      display: block;
      width: auto;
      height: 1em;
    }
  }

  .menu-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;

    button {
      max-height: 38px;
      border-radius: 1rem;
      height: 100%;
      font-size: small;
    }

    .button-buy {
      max-height: 40px;
      border-radius: 1rem;
      height: 100%;
      font-size: 0.9em;
      font-weight: 500;
      background: var(--color-background) !important;
      border: 1px solid var(--color-dim) !important;

      > * {
        overflow: visible;
      }
    }

    select {
      max-height: 38px;
      padding: 1rem 1.25rem;
      background: var(--color-background);
    }
  }

  .smol-links {
    display: flex;
    font-size: var(--font-size-xsmall);
    align-items: center;
    padding: 1rem 1.5rem;
    color: var(--color-dim);

    > * + * :before {
      content: '•';
      margin: 0 1rem;
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
    display: flex;
    align-items: center;
    border: none;
    cursor: pointer;
    background: var(--color-activeBackground);
    padding: 1.25rem;
    border-radius: 1rem;
    transition: all 0.15s ease-in-out;
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
    grid-template: 1fr / 1fr 2fr;

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
