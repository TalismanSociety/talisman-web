import { LanguageSelector } from '@archetypes/LanguageSelector'
import bgImage from '@assets/card-gradient.png'
import { ReactComponent as TalismanHandLogo } from '@assets/hand-red-black.svg'
import { Button } from '@components'
import { WalletSelect } from '@talisman-connect/components'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const TermsOfService = styled(({ className }) => {
  const { t } = useTranslation('connect-wallet')
  return (
    <span className={className}>
      {/* <Trans i18nKey="TOS" ns="connect-wallet"> */}
      {t('By connecting your wallet you agree to our')}{' '}
      <a
        href="https://glib-calendula-bf6.notion.site/Terms-of-use-6ac8a57691a946f0b4805c34b26be2b9"
        target="_blank"
        rel="noreferrer noopener"
      >
        {t('Terms of use')}
      </a>
      {/* </Trans> */}
    </span>
  )
})`
  color: var(--color-mid);
  margin-top: 1rem;
  font-size: 10px;
  text-align: center;

  a {
    white-space: nowrap;
    opacity: 1;
    color: var(--color-text);
    text-decoration: underline;
  }
`

const TalismanLogo = styled(TalismanHandLogo)`
  height: 10rem;
  width: 100%;
  margin: 0 auto;
`

const Welcome = styled(({ className }) => {
  const { t } = useTranslation('welcome')
  const { t: tBase } = useTranslation()
  return (
    <section
      className={className}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <LanguageSelector className="lang-select" />
      <div className="description">
        <TalismanLogo />
        <h1 className="headline">{t('header')}</h1>
        <div style={{ width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <WalletSelect
            triggerComponent={<Button primary>{tBase('Connect wallet')}</Button>}
            onError={err => {
              console.log(`>>> err`, err)
            }}
          />
        </div>
      </div>
      <TermsOfService />
    </section>
  )
})`
  color: var(--color-text);
  width: 100%;
  display: grid;
  grid-template: auto 1fr / 1fr;
  place-items: center;
  margin: auto;
  height: 100%;
  row-gap: 4rem;
  padding: 2rem;

  @media ${device.sm} {
    padding: 4rem;
  }

  .lang-select {
    justify-self: end;
  }

  .connect-wallet {
    justify-self: center;
  }

  .headline {
    font-family: SurtExtended;
    text-align: center;
    margin: 4rem auto;
    max-width: 100%;
    overflow-wrap: break-word;
    hyphens: manual;

    @media ${device.lg} {
      max-width: 80%;
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
