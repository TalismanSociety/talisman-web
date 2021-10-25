import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import { Pill } from '@components'
import { ReactComponent as ChevronRight } from '@icons/chevron-right.svg'
import { device } from '@util/breakpoints'
import { cloneElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface ConnectWalletItemProps {
  className?: string
  name: string
  src: string
  LinkComponent?: React.ReactElement
  featured?: boolean
  disabled?: boolean
}

const Badge = styled(({ className, children }) => {
  return (
    <Pill className={className} small primary>
      {children}
    </Pill>
  )
})`
  position: absolute;
  top: -20px;
  right: -20px;
`

const FeaturedConnectWalletItem = styled((props: ConnectWalletItemProps) => {
  const { t } = useTranslation('connect-wallet')
  const { className = '', src, name } = props
  return (
    <div className={className}>
      <img height={48} width={48} src={src} alt={name} />
      <span>{name}</span>
      <Badge>{t('Coming soon')}</Badge>
    </div>
  )
})`
  position: relative;
  flex-direction: column;
  > img {
    border-radius: 1.5rem;
  }
  > * + * {
    margin-top: 0.5rem;
  }
`

const ConnectItem = styled((props: ConnectWalletItemProps) => {
  const { className = '', src, name, featured = false, disabled } = props
  if (featured) {
    return <FeaturedConnectWalletItem {...props} />
  }
  return (
    <div className={className}>
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

const ConnectWalletSelection = styled(({ className = '' }) => {
  const { t } = useTranslation('connect-wallet')
  return (
    <aside className={className}>
      <section>
        <h2>{t('Connect a wallet')}</h2>
        <ConnectWalletItem
          name="Polkadot{js}"
          src={`https://polkadot.js.org/docs/img/logo.svg`}
          LinkComponent={<Link to="/portfolio" />}
        />
      </section>
      <section>
        <h3>{t('Coming soon')}</h3>
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
      <NoWallet />
    </aside>
  )
})`
  background: var(--color-controlBackground);
  color: var(--color-mid);
  padding: 4rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  min-width: 35%;

  > * + * {
    margin-top: 3rem;
  }

  > section {
    width: 100%;
    text-align: center;
  }

  > section > * + * {
    margin-top: 1rem;
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
        <h1>{t('header')}</h1>
        <p>{t('description')}</p>
      </div>
      <ConnectWalletSelection />
    </section>
  )
})`
  width: 100%;
  padding: 0 6vw;
  margin: 12rem auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--color-text);
  justify-content: space-between;
  flex-wrap: wrap;

  @media ${device.xxl} {
    padding: 0 18vw;
    gap: 4rem;
  }

  .description {
    flex: 1 0 40%;
    * + * {
      margin-top: 4rem;
    }
  }
`

export default Welcome
