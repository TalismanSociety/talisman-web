import { ConnectWalletSelection } from '@archetypes/ConnectWalletSelection/ConnectWalletSelection'
import { ReactComponent as TalismanWordLogo } from '@assets/talisman-red-black.svg'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

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
