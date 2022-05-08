import alphaExtensionImage from '@assets/alpha-extension.png'
import bannerImage from '@assets/gradient-purple-red.png'
import { Banner } from '@components/Banner'
import { Draggable } from '@components/Draggable'
import { Droppable } from '@components/Droppable'
import { ReactComponent as ArrowRight } from '@icons/arrow-right.svg'
import { trackGoal } from '@libs/fathom'
import { OwnershipText } from '@libs/spiritkey/OwnershipText'
import { SpiritKeyNftImage } from '@libs/spiritkey/SpiritKeyNftImage'
import { SpiritKeySender } from '@libs/spiritkey/SpiritKeySender'
import { useFetchNFTs } from '@libs/spiritkey/useFetchNFTs'
import { DAPP_NAME } from '@libs/talisman'
import { WalletSelect } from '@talisman-connect/components'
import { device } from '@util/breakpoints'
import { downloadURI } from '@util/downloadURI'
import { TALISMAN_EXTENSION_DOWNLOAD_URL } from '@util/links'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

export const SpiritKeyUnlockBanner = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const { t: tBase } = useTranslation()
  const [downloading, setDownloading] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [showAltDownload, setShowAltDownload] = useState(false)
  const totalNFTs = useFetchNFTs()
  const hasNfts = totalNFTs?.length > 0
  const dragSrcId = 'spirit-key-id'
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>()

  useEffect(() => {
    const item = localStorage.getItem('@talisman-connect/selected-wallet-name')
    if (item && item !== 'null') {
      setSelectedWallet(item)
    }
  }, [totalNFTs])

  useEffect(() => {
    if (!downloading) {
      return
    }
    setTimeout(() => setShowAltDownload(true), 1000)
  }, [downloading, showAltDownload])

  return (
    <Banner className={className} backgroundImage={bannerImage}>
      <div className="center space-y-2">
        <Draggable id={dragSrcId} disabled={!hasNfts}>
          <SpiritKeyNftImage border />
        </Draggable>
        <div className="center space-y-1">
          <OwnershipText />
          <SpiritKeySender />
        </div>
      </div>
      <div className="center">
        <ArrowRight className="arrow-right" />
        {selectedWallet && hasNfts ? (
          <div>{t('Drag to unlock')}</div>
        ) : (
          <WalletSelect
            dappName={DAPP_NAME}
            triggerComponent={
              <div
                style={{
                  textDecoration: 'underline',
                  opacity: 'inherit',
                  cursor: 'pointer',
                  color: `var(--color-primary)`,
                }}
              >
                {tBase(selectedWallet ? 'Switch wallet' : 'Connect wallet')}
              </div>
            }
          />
        )}
      </div>
      <div className="center relative">
        <Droppable
          id={dragSrcId}
          onDragEnter={() => setRevealing(true)}
          onDragLeave={() => setRevealing(false)}
          onDrop={(e: DragEvent) => {
            setRevealing(false)
            setDownloading(true)
            downloadURI(TALISMAN_EXTENSION_DOWNLOAD_URL)
            trackGoal('TE3SATFD', 0) // alpha_downloads
          }}
        >
          <img
            src={alphaExtensionImage}
            alt="Talisman Extension"
            className={`alpha-extension ${downloading ? 'downloading' : ''} ${revealing ? 'revealing' : ''}`}
          />
        </Droppable>
        {showAltDownload && (
          <a
            href={TALISMAN_EXTENSION_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="footnote footnote-position"
            style={{ bottom: '-1rem' }}
            onClick={() => {
              setShowAltDownload(false)
              setDownloading(false)
              trackGoal('TE3SATFD', 0) // alpha_downloads
            }}
          >
            {t('altDownload')}
          </a>
        )}
      </div>
    </Banner>
  )
})`
  user-select: none;
  border-radius: 6.4rem;
  padding: 8rem;
  margin-bottom: 2rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  @media ${device.xl} {
    flex-direction: row;
  }

  .center {
    text-align: center;
  }

  .relative {
    position: relative;
  }

  .space-y-2 > * + * {
    margin-top: 2rem;
  }

  .space-y-1 > * + * {
    margin-top: 1rem;
  }

  .arrow-right {
    width: 4.8rem;
    height: auto;
    transform: rotate(90deg);

    @media ${device.xl} {
      transform: unset;
    }
  }

  .alpha-extension {
    height: auto;
    width: 31rem;
    filter: blur(1rem);
    transition: filter 1s ease-out;

    &.downloading {
      transition: filter 0.5s ease-in;
      filter: unset;
    }

    &.revealing {
      transition: filter 0.5s ease-in;
      filter: blur(0.1rem);
    }
  }

  .footnote {
    font-size: x-small;
    color: var(--color-mid);
  }

  .footnote-position {
    position: absolute;
    left: 0;
    right: 0;
  }
`
