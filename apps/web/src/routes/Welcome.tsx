import { LanguageSelector } from '@archetypes/LanguageSelector'
import bgImage from '@assets/card-gradient.png'
import { ReactComponent as TalismanHandLogo } from '@assets/hand-red-black.svg'
import { Button } from '@components'
import styled from '@emotion/styled'
import { DAPP_NAME } from '@libs/talisman'
import { WalletSelect } from '@talismn/connect-components'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'

const TermsOfService = styled(({ className }) => {
  const { t } = useTranslation('connect-wallet')
  return (
    <span className={className}>
      {/* <Trans i18nKey="TOS" ns="connect-wallet"> */}
      {t('By connecting your wallet you agree to our')}{' '}
      <a
        href="https://docs.talisman.xyz/talisman/legal-and-security/terms-of-use"
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
  height: auto;
  width: 13.6rem;
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
      <div className="content">
        <TalismanLogo />
        <h1 className="headline">{t('header')}</h1>
        <p className="description">{t('description')}</p>
        <div className="cta">
          <WalletSelect
            dappName={DAPP_NAME}
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

  .content {
    text-align: center;
    font-family: Surt, sans-serif;
  }

  .headline {
    font-family: SurtExtended, sans-serif;
    font-size: xxx-large;
    margin: 2rem auto;
    max-width: 100%;
    overflow-wrap: break-word;
    hyphens: manual;
  }

  .description {
    font-size: x-large;
    opacity: 0.9;
    max-width: 80%;
    margin: 4rem auto;
  }

  .cta {
    width: 100%;
    margin: 4rem auto auto;
  }

  .subheading {
    font-size: var(--font-size-large);
    @media ${device.md} {
      font-size: var(--font-size-xlarge);
    }
  }
`

export default Welcome
