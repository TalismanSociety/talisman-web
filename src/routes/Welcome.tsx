import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import { Button } from '@components'
import { ReactComponent as ChevronRight } from '@icons/chevron-right.svg'
import { useExtension } from '@libs/talisman'
import { device } from '@util/breakpoints'
import { cloneElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface ConnectWalletItemProps {
  className?: string
  name: string
  description?: string
  cta?: React.ReactNode
  src: string
  LinkComponent?: React.ReactElement
  featured?: boolean
  disabled?: boolean
  onClick?: () => void
}

const FeaturedConnectWalletItem = styled((props: ConnectWalletItemProps) => {
  const { className = '', src, name, description, cta, onClick } = props
  return (
    <div className={className} onClick={onClick}>
      <img className="logo" height={48} width={48} src={src} alt={name} />
      <div className="title">{name}</div>
      <div className="description">{description}</div>
      <div className="cta">{cta}</div>
      {/* TODO: Remove illustrations for now */}
      {/* <img className="left-character" src={agyleImage} alt="" />
      <img className="right-character" src={hoodImage} alt="" /> */}
    </div>
  )
})`
  position: relative;
  flex-direction: column;
  > .logo {
    border-radius: 1rem;
  }
  > .left-character {
    display: none;
    @media ${device.sm} {
      display: block;
      position: absolute;
      top: 0;
      right: 2rem;
    }
    @media ${device.lg} {
      right: 10rem;
    }
  }
  > .right-character {
    display: none;
    @media ${device.sm} {
      display: block;
      position: absolute;
      top: 0;
      left: 6rem;
    }
    @media ${device.md} {
      left: 10rem;
    }
    @media ${device.lg} {
      left: 16rem;
    }
  }
  > * + * {
    margin-top: 0.5rem;
  }
  .title {
    font-family: 'SurtExpanded', sans-serif;
    font-size: var(--font-size-xlarge);
  }
  .description {
    color: var(--color-foreground);
  }
  .cta {
    margin-top: 3rem;
  }
`

const ConnectItem = styled((props: ConnectWalletItemProps) => {
  const { className = '', src, name, featured = false, disabled, onClick } = props
  if (featured) {
    return <FeaturedConnectWalletItem {...props} />
  }
  return (
    <div className={className} onClick={onClick}>
      <div className="icon-name">
        <img height={24} width={24} src={src} alt={name} />
        <span>{name}</span>
      </div>
      <ChevronRight />
      {disabled && <div className="disabled-overlay" />}
    </div>
  )
})`
  position: relative;
  background: var(--color-background);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :hover {
    background: var(--color-activeBackground);
    cursor: pointer;
  }

  .disabled-overlay {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(${({ theme }) => theme.background}, 0.6);
    width: 100%;
    height: 100%;
    border-radius: inherit;

    :hover {
      background-color: rgba(${({ theme }) => theme.background}, 0.5);
    }
  }

  .icon-name {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  img {
    border-radius: 1.5rem;
  }
`

const ConnectWalletItem = (props: ConnectWalletItemProps) => {
  const { LinkComponent } = props

  if (!LinkComponent) {
    return <ConnectItem {...props} />
  }

  return (
    <div>
      {cloneElement(LinkComponent, {
        children: <ConnectItem {...props} />,
      })}
    </div>
  )
}

const NoWallet = styled(({ className = '' }) => {
  const { t } = useTranslation('connect-wallet')
  return (
    <a
      className={className}
      href="https://www.youtube.com/watch?v=mT7rUlQh660"
      target="_blank"
      rel="noreferrer noopener"
    >
      {t('No wallet')}
    </a>
  )
})`
  text-decoration: underline;
  color: var(--color-text);
`

// TODO: Deprecate this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ComingSoonWallets = styled(() => {
  const { t } = useTranslation('connect-wallet')
  return (
    <section>
      <h3 className="connect-subheadline">{t('Coming soon')}</h3>
      <ConnectWalletItem
        disabled
        name="Talisman Wallet"
        src={`
          https://pbs.twimg.com/profile_images/1433018747762085891/ZATzx-HG_400x400.jpg`}
      />
      <ConnectWalletItem
        disabled
        name="Wallet Connect"
        src={`https://pbs.twimg.com/profile_images/998895674522353665/mQFAbUOX_400x400.jpg`}
      />
    </section>
  )
})`
  .connect-subheadline {
    font-family: 'SurtExpanded', sans-serif;
    color: var(--color-dim);
    font-size: var(--font-size-large);
  }
`

const TermsOfService = styled(({ className }) => {
  return (
    <span className={className}>
      <Trans i18nKey="TOS" ns="connect-wallet">
        By connecting your wallet you agree to our
        <a
          href="https://glib-calendula-bf6.notion.site/Terms-of-use-6ac8a57691a946f0b4805c34b26be2b9"
          target="_blank"
          rel="noreferrer noopener"
        >
          Terms of use
        </a>
      </Trans>
    </span>
  )
})`
  color: var(--color-dim);
  margin-top: 1rem;
  font-size: 10px;

  a {
    color: var(--color-text);
    text-decoration: underline;
  }
`

const ConnectWalletSelection = styled(({ className = '' }) => {
  const { t } = useTranslation('connect-wallet')
  const { connect } = useExtension()

  return (
    <div className={className}>
      <aside>
        <section>
          <h2 className="connect-headline">{t('Connect a wallet')}</h2>
          <ConnectWalletItem name="Polkadot{js}" src={`https://polkadot.js.org/docs/img/logo.svg`} onClick={connect} />
        </section>
        <TermsOfService />
        <NoWallet className="no-wallet" />
      </aside>
      <aside>
        <FeaturedConnectWalletItem
          name={t('Talisman Extension')}
          description={t('Wallet extension coming soon')}
          src={`
          https://pbs.twimg.com/profile_images/1433018747762085891/ZATzx-HG_400x400.jpg`}
          cta={
            <Button variant="outlined">
              <a href="https://m9m0weaebgi.typeform.com/mailing-list" target="_blank" rel="noreferrer noopener">
                {t('Get updates')}
              </a>
            </Button>
          }
        />
      </aside>
    </div>
  )
})`
  aside {
    background: var(--color-controlBackground);
    color: var(--color-text);
    padding: 4rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    text-align: center;

    section {
      width: 100%;
    }
  }

  > aside + aside {
    margin-top: 2rem;
  }

  .no-wallet {
    margin-top: 2rem;
  }

  .connect-headline {
    font-family: 'SurtExpanded', sans-serif;
    font-size: var(--font-size-xlarge);
  }
`

const TalismanLogo = styled(TalismanWordLogo)`
  height: 3rem;
  width: auto;
`

const Welcome = styled(({ className }) => {
  const { t } = useTranslation('welcome')
  return (
    <section className={className}>
      <div className="description">
        <TalismanLogo />
        <h1 className="headline">{t('header')}</h1>
        <p className="subheading">{t('description')}</p>
      </div>
      <ConnectWalletSelection className="connect-wallet" />
    </section>
  )
})`
  color: var(--color-text);
  max-width: 1280px;
  display: grid;
  grid-template: auto 1fr / 1fr;
  place-items: center;
  margin: auto;
  height: 100%;
  row-gap: 4rem;
  padding: 4rem;

  @media ${device.xl} {
    grid-template: 1fr / 2fr 1fr;
    column-gap: 4rem;
  }

  .description > * + * {
    margin-top: 4rem;
  }

  .connect-wallet {
    justify-self: center;
  }

  .headline {
    font-size: var(--font-size-xxlarge);
    @media ${device.md} {
      font-size: var(--font-size-xxxlarge);
    }
  }

  .subheading {
    font-size: var(--font-size-large);
    @media ${device.md} {
      font-size: var(--font-size-xlarge);
    }
  }
`

export default Welcome
