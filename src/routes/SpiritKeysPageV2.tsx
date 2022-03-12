import handRedBlack from '@assets/hand-red-black.svg'
import talismanSpiritKey from '@assets/spirit-key.png'
import { Button } from '@components'
import { StyledLoader } from '@components/Await'
import { OwnershipText } from '@libs/spiritkey/OwnershipText'
import { SpiritKeyNftImage } from '@libs/spiritkey/SpiritKeyNftImage'
import { SpiritKeySender } from '@libs/spiritkey/SpiritKeySender'
import { useFetchNFTs } from '@libs/spiritkey/useFetchNFTs'
import { DAPP_NAME, useAllAccountAddresses, useExtensionAutoConnect } from '@libs/talisman'
import { useTalismanInstalled } from '@libs/talisman/useIsTalismanInstalled'
import { WalletSelect } from '@talisman-connect/components'
import { device } from '@util/breakpoints'
import { DISCORD_JOIN_URL, TALISMAN_EXTENSION_CHROMESTORE_URL, TALISMAN_SPIRIT_KEYS_RMRK } from '@util/links'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

const SpiritKeyPlaceholder = styled(({ className }) => {
  return (
    <div className={className}>
      <div className="content">
        <div>
          <Trans
            ns="spirit-keys"
            i18nKey={'spiritClan.noKeyPlaceholder'}
            components={{
              a: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a href={TALISMAN_SPIRIT_KEYS_RMRK} title="Singular" target="_blank" rel="noopener noreferrer" />
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
})`
  border: 1px solid var(--color-mid);
  border-radius: 3rem;
  padding: 1.2rem;
  height: 23.5rem;
  width: 23.5rem;
  margin: auto;

  a {
    text-decoration: underline;
  }

  .content {
    height: 100%;
    display: flex;
    align-items: center;
  }
`

const SpiritKeyPageV2 = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const { t: tBase } = useTranslation()
  const totalNFTs = useFetchNFTs()
  const hasNfts = totalNFTs?.length > 0
  const addresses = useAllAccountAddresses()
  const addressesLoading = addresses === undefined
  const { status } = useExtensionAutoConnect()
  const isTalismanInstalled = useTalismanInstalled()

  if (addressesLoading) {
    return <StyledLoader />
  }

  return (
    <section className={className}>
      <div className="content">
        <div className="spirit-key-control-group">
          {!isTalismanInstalled && (
            <div className="no-wallet">
              <p>{tBase('extensionUnavailable.subtitle')}</p>
              <a
                href={TALISMAN_EXTENSION_CHROMESTORE_URL}
                title="Install Talisman"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button primary>{tBase('Install Talisman Extension')}</Button>
              </a>
            </div>
          )}
          {status !== 'OK' && isTalismanInstalled && (
            <>
              <SpiritKeyPlaceholder />
              <div>{t('spiritClan.alreadyHaveOne')}</div>
              <WalletSelect
                dappName={DAPP_NAME}
                triggerComponent={<Button primary>{tBase('Connect wallet')}</Button>}
              />
            </>
          )}
          {status === 'OK' && totalNFTs === undefined && <StyledLoader />}
          {status === 'OK' && totalNFTs && !hasNfts && (
            <>
              <SpiritKeyPlaceholder />
              <div>{t('spiritClan.alreadyHaveOne')}</div>
              <WalletSelect
                dappName={DAPP_NAME}
                triggerComponent={<Button primary>{tBase('Connect wallet')}</Button>}
              />
            </>
          )}
          {hasNfts && (
            <>
              <SpiritKeyNftImage border />
              <OwnershipText />
              <div>
                <a href={DISCORD_JOIN_URL} target="_blank" rel="noreferrer noopener" title="Join Spirit Clan">
                  <Button primary>{t('spiritClan.joinSpiritClan')}</Button>
                </a>
              </div>
              <SpiritKeySender />
            </>
          )}
        </div>
        <div className="poem">
          {(t('spiritClan.poem', { returnObjects: true }) as []).map(sentence => {
            return <div key={sentence}>{sentence}</div>
          })}
        </div>
        <div className="info">
          <div className="section">
            <h1 className="intro">{t('spiritClan.title')}</h1>
            <p>
              <Trans
                ns="spirit-keys"
                i18nKey={'spiritClan.info.0'}
                components={{
                  a: (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a href={DISCORD_JOIN_URL} title="Join Spirit Clan" target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              />
            </p>
            <p>{t('spiritClan.info.1')}</p>
            <p>{t('spiritClan.info.2')}</p>
          </div>
          <div className="section">
            <img className="w-full" src={talismanSpiritKey} alt="Spirit Key" />
          </div>
        </div>
      </div>
    </section>
  )
})`
  text-align: center;
  color: var(--color-text);

  .w-full {
    width: 100%;
  }

  p {
    @media ${device.lg} {
      font-size: var(--font-size-xlarge);
    }
  }

  .no-wallet {
    margin: var(--padding-large);

    p {
      margin: var(--padding);
    }
  }

  .poem {
    font-family: ATApocRevelations, sans-serif;
    font-size: var(--font-size-xlarge);
    margin: 8rem 0;

    @media ${device.lg} {
      font-size: var(--font-size-xxlarge);
    }
  }

  .info {
    margin-top: 8rem;
    flex-wrap: wrap-reverse;
    display: flex;
    gap: 4rem;

    @media ${device.lg} {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      text-align: left;
    }

    a {
      color: inherit;
      text-decoration: underline;
      opacity: unset;
    }
  }

  .banner-text {
    width: 100%;
    height: auto;
    margin: 4rem 0;
    padding: 0 4rem;
  }

  .intro {
    color: var(--color-text);
    font-family: SurtExtended, serif;
    font-size: 3.2rem;
    margin-bottom: 4.3rem;
  }

  > .content {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;

    padding: 0 5vw;
    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: column;

    position: relative;
  }

  > .content::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-image: url(${handRedBlack});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    opacity: 0.65;
    filter: blur(40px);
    @media ${device.lg} {
      background-size: 80%;
      filter: blur(60px);
    }
  }

  .spirit-key-control-group {
    display: none;
    @media ${device.lg} {
      display: block;
      margin: 8rem;
    }
  }

  .spirit-key-control-group > * + * {
    margin-top: 1.2rem;
  }
`

export default SpiritKeyPageV2
