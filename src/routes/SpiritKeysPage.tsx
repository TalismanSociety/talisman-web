import { JoinButton } from '@archetypes/JoinButton/JoinButton'
import miksySpiritKeysAudio from '@assets/miksy-spirit-keys.mp3'
import bannerImage from '@assets/unlock-the-paraverse.png'
import { Button, DesktopRequired, Field } from '@components'
import { StyledLoader } from '@components/Await'
import { TalismanHandLike } from '@components/TalismanHandLike'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { ReactComponent as PauseCircle } from '@icons/pause-circle.svg'
import { ReactComponent as PlayCircle } from '@icons/play-circle.svg'
import { trackGoal } from '@libs/fathom'
import { useAllAccountAddresses, useExtensionAutoConnect } from '@libs/talisman'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { web3FromAddress } from '@talismn/dapp-connect'
import { encodeAnyAddress } from '@talismn/util'
import { isMobileBrowser } from '@util/helpers'
import { TALISMAN_EXTENSION_DOWNLOAD_URL } from '@util/links'
import { AnyAddress, SS58Format, convertAnyAddress } from '@util/useAnyAddressFromClipboard'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { consolidatedNFTtoInstance } from 'rmrk-tools'
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator'
import styled from 'styled-components'

import { fetchNFTData } from '../libs/spiritkey/spirit-key'

const isValidAddress = (address: AnyAddress) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

const getApi = async (wsEndpoint: string): Promise<ApiPromise> => {
  const wsProvider = new WsProvider(wsEndpoint)
  const api = ApiPromise.create({ provider: wsProvider })
  return api
}

async function setupSender() {
  await cryptoWaitReady()
  const ws = 'wss://kusama-rpc.polkadot.io'
  const api = await getApi(ws)
  return api
}

function useFetchNFTs() {
  const [totalNFTs, setNFTs] = useState<NFTConsolidated[]>()
  const accountAddresses = useAllAccountAddresses()
  const encoded = useMemo(() => accountAddresses?.map(account => encodeAnyAddress(account, 2)), [accountAddresses])

  useEffect(() => {
    fetchNFTData(setNFTs, encoded as string[])
  }, [setNFTs, encoded])

  return totalNFTs
}

function useSender() {
  const [api, setApi] = useState<ApiPromise>()
  useEffect(() => {
    setupSender().then(apiObject => setApi(apiObject))
  }, [])
  return api
}

async function setupRemark(nftObject: NFTConsolidated, toAddress: AnyAddress) {
  if (!toAddress) {
    return undefined
  }
  const nft = consolidatedNFTtoInstance(nftObject)
  const remark = await nft?.send(toAddress as string)

  // TODO: For now, this is a workaround as v2 send is not compatible with v1 remarks
  return remark?.replace('2.0.0', '1.0.0')
}

async function setupInjector(nftObject: NFTConsolidated) {
  if (!nftObject) {
    return undefined
  }
  try {
    const injector = await web3FromAddress(nftObject?.account)
    return injector
  } catch (err) {
    console.error('>>> setupInjector', err)
  }
}

function useNftRemark(nftObject: NFTConsolidated, toAddress: AnyAddress) {
  const [remark, setRemark] = useState<string | undefined>()
  useEffect(() => {
    setupRemark(nftObject, toAddress).then(r => setRemark(r))
  }, [nftObject, toAddress])
  return remark
}

function useInjector(nftObject: NFTConsolidated) {
  const [injector, setInjector] = useState<unknown>()
  useEffect(() => {
    setupInjector(nftObject).then(i => setInjector(i))
  }, [nftObject])
  return injector
}

type SendStatus = 'INPROGRESS' | 'SUCCESS' | 'FAILED'

const sendNFT = async (senderAddress: string, api: ApiPromise, remark: string, injector: any, cb: any) => {
  const txs = [api.tx.system.remark(remark)]
  const tx = api.tx.utility.batchAll(txs)
  const txSigned = await tx.signAsync(senderAddress, { signer: injector.signer })

  const unsub = await txSigned.send(async result => {
    const { status, events = [], dispatchError } = result

    for (const {
      phase,
      event: { data, method, section },
    } of events) {
      console.info(`\t${phase}: ${section}.${method}:: ${data}`)
    }

    let txStatus: SendStatus = 'INPROGRESS'

    if (status.isInBlock) {
      console.info(`Transaction included at blockHash ${status.asInBlock}`)
    }
    if (status.isFinalized) {
      console.info(`Transaction finalized at blockHash ${status.asFinalized}`)
      unsub()

      const someSuccess = events.some(
        ({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess'
      )
      const someFailed = events.some(
        ({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed'
      )

      if (dispatchError && dispatchError.isModule && api) {
        const decoded = api.registry.findMetaError(dispatchError.asModule)
        const { docs, name, section } = decoded
        console.log('error', `${section}.${name}: ${docs.join(' ')}`)
        txStatus = 'FAILED'
      } else if (dispatchError) {
        console.log('error', dispatchError.toString())
        txStatus = 'FAILED'
      }

      if (someSuccess && !someFailed) {
        txStatus = 'SUCCESS'
      }

      console.log(txStatus)
    }
    if (cb) {
      cb(txStatus)
    }
  })
}

function useNftSender(nft: NFTConsolidated, toAddress: AnyAddress): [SendStatus | undefined, () => void, () => void] {
  const api = useSender()
  const kusamaAddress = convertAnyAddress(toAddress, SS58Format.Kusama)
  const remark = useNftRemark(nft, kusamaAddress)
  const injector = useInjector(nft)
  const [status, setStatus] = useState<SendStatus | undefined>()

  const send = async () => {
    await sendNFT(nft.owner, api, remark, injector, setStatus)
  }

  if (!api) {
    return [undefined, () => {}, () => {}]
  }

  return [status, send, () => setStatus(undefined)]
}

const Modal = styled(({ className, children }) => {
  return (
    <div className={className}>
      <div className="modal">{children}</div>
      <div className="overlay" />
    </div>
  )
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .overlay {
    position: absolute;
    background: var(--color-background);
    opacity: 0.8;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .modal {
    position: absolute;
    background: var(--color-activeBackground);
    right: 0;
    left: 0;
    top: 30%;
    padding: 4rem;
    border-radius: 2rem;
    margin: auto;
    width: 50%;
    z-index: 1;
  }
`

const InProgress = styled(({ className, closeModal, explorerUrl }) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('inProgress.header')}</h2>
        <TalismanHandLoader />
      </header>
      <main>
        <div>{t('inProgress.description')}</div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('inProgress.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button onClick={closeModal}>{t('inProgress.secondaryCta')}</Button>
      </footer>
    </div>
  )
})`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 8.2rem;
    color: var(--color-primary);
    user-select: none;
  }

  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;

    div:first-child {
      margin-bottom: 4rem;
    }
    a {
      display: block;
      color: var(--color-background);
      background: var(--color-primary);
      border-radius: 5.6rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
    }
  }

  > footer {
    display: flex;
    justify-content: center;

    button {
      min-width: 27.8rem;
    }
  }
`

const Success = styled(({ className, closeModal, explorerUrl }) => {
  const { t } = useTranslation('crowdloan')
  return (
    <div className={className}>
      <header>
        <h2>{t('success.header')}</h2>
        <TalismanHandLike />
      </header>
      <main>
        <div>{t('success.description')}</div>
        <div style={{ fontWeight: 'bold', fontSize: 'small', color: 'var(--color-text)' }}>
          The transfer will take a few minutes to sync so please avoid sending again.
        </div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('success.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button primary onClick={closeModal}>
          Done
        </Button>
      </footer>
    </div>
  )
})`
  > header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;
  }
  > header > h2 {
    text-align: center;
    font-size: 2.4rem;
    font-weight: 600;
  }
  > header > .logo {
    font-size: 6.4rem;
    margin-bottom: 8.2rem;
    color: var(--color-primary);
    user-select: none;
  }

  > main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;

    div:first-child {
      margin-bottom: 4rem;
    }
    a {
      display: block;
      color: var(--color-background);
      background: var(--color-primary);
      border-radius: 5.6rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
    }
  }

  > footer {
    display: flex;
    justify-content: center;

    button {
      min-width: 27.8rem;
    }
  }
`

const SendNft = styled(({ className, nft }) => {
  const [toAddress, setToAddress] = useState<AnyAddress>('')
  const [status, sendNft, resetStatus] = useNftSender(nft, toAddress)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (toAddress !== '' && (status === 'SUCCESS' || status === 'FAILED')) {
      setToAddress('')
    }
  }, [status, toAddress])

  useEffect(() => {
    if (!showModal && toAddress !== '' && (status === 'SUCCESS' || status === 'INPROGRESS')) {
      setShowModal(true)
    }
  }, [showModal, status, toAddress])

  if (!sendNft) {
    return <StyledLoader />
  }

  if (showModal && status === 'INPROGRESS') {
    return (
      <Modal>
        <InProgress />
      </Modal>
    )
  }

  if (showModal && status === 'SUCCESS') {
    return (
      <Modal>
        <Success closeModal={() => resetStatus()} />
      </Modal>
    )
  }

  return (
    <>
      <div className={className}>
        <Field.Input
          value={toAddress}
          onChange={setToAddress}
          dim
          type="text"
          placeholder="Enter Kusama Address"
          className="toAddress"
        />
        <Button
          primary
          disabled={!isValidAddress(toAddress)}
          onClick={(e: any) => {
            sendNft()
          }}
        >
          Send
        </Button>
      </div>
      {status === 'FAILED' && <>Error sending NFT</>}
    </>
  )
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > .field {
    width: 50%;
  }

  > button {
    max-height: 4.7rem;
    border-radius: 1rem;
  }
`

function useAudio(src: string, play?: boolean) {
  const audioRef = useRef(new Audio(src))
  const [isPlaying, setPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
    const ref = audioRef.current
    return () => {
      ref.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (play !== undefined) {
      setPlaying(play)
    }
  }, [play])

  function togglePlay() {
    setPlaying(!isPlaying)
  }

  return {
    isPlaying,
    setPlaying,
    togglePlay,
  }
}

const SimplePlay = styled(({ className, src }) => {
  const { isPlaying, togglePlay } = useAudio(src)
  return (
    <button className={className} onClick={togglePlay}>
      {isPlaying ? <PauseCircle /> : <PlayCircle />}
    </button>
  )
})`
  padding: 0;
  border: 0;
  background: inherit;
  cursor: pointer;
  display: flex;

  svg {
    width: 3rem;
    height: auto;
  }
`

const Attribution = styled(({ className }) => {
  return (
    <span className={className}>
      Music by{' '}
      <a
        href="https://soundcloud.com/miksyyy/spirit-keys?si=45ddd3a44b7c4ecc80ca1c31a1a846d9"
        target="_blank"
        rel="noreferrer noopener"
      >
        Miksy
      </a>
    </span>
  )
})`
  color: var(--color-dim);
  a {
    color: var(--color-mid);
    text-decoration: underline;
  }
`

const SpiritKeyNft = styled(({ className, src }) => {
  return (
    <div className={className}>
      <div className="floating-card__card">
        <div className="floating-card__card__inner-container">
          <img className="spirit-key-image" src={src} alt="Spirit Key" />

          <div className="floating-card__card__inner-container__shimmer"></div>
        </div>

        <div className="floating-card__card__background-scroller"></div>
      </div>
      <div className="spirit-keys-music-info">
        <SimplePlay src={miksySpiritKeysAudio} />
        <Attribution />
      </div>
    </div>
  )
})`
  .spirit-keys-music-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem;
  }

  .spirit-key-image {
    width: 100%;
    object-fit: cover;
    &:hover {
      cursor: pointer;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .floating-card__card {
    width: 316px;
    height: 316px;
    background: #fff;
    position: relative;
    margin: 4rem auto 0;
    padding: 10px;
    text-align: center;
    box-shadow: 1px 1px 1px #000;
    overflow: hidden;
    animation: floating 10s ease-in-out infinite;
  }

  .floating-card__card__inner-container {
    width: 97%;
    height: 97%;
    background: #dbdbdb;
    margin: 0 auto;
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .floating-card__card__inner-container__shimmer {
    width: 200%;
    height: 40px;
    background: #eee;
    position: absolute;
    top: -80%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    animation-name: slideBottomRightAndBack;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .floating-card__card__background-scroller {
    width: 1800px;
    height: 300px;
    background: orange;
    position: absolute;
    top: -800px;
    left: 20%;
    transform: translate(-50%, 0) rotate(-35deg);
    animation-name: slideBottomRight;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .floating-card__floor-shadow {
    width: 200px;
    height: 10px;
    background: #000;
    margin: 20px auto 0 auto;
    border-radius: 40%;
    animation: scalingShadow 10s ease-in-out infinite;
  }

  @keyframes floating {
    25% {
      transform: translateY(5px);
    }
    50% {
      transform: translateY(0px);
    }
    75% {
      transform: translateY(5px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  @keyframes scalingShadow {
    25% {
      transform: scale(1.05);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes slideBottomRight {
    0% {
      transform: translate(-50%, 0) rotate(-35deg);
    }
    100% {
      transform: translate(-50%, 2200px) rotate(-35deg);
    }
  }

  @keyframes slideBottomRightAndBack {
    0% {
      transform: translate(-50%, 0) rotate(-45deg);
    }
    90% {
      transform: translate(-50%, 0) rotate(-45deg);
    }
    100% {
      transform: translate(-50%, 900px) rotate(-45deg);
    }
  }
`

const SpiritKey = styled(({ className }) => {
  const baseImage = 'https://rmrk.mypinata.cloud/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4'
  const [currentNFT, setCurrentNFT] = useState<number>(0)
  const addresses = useAllAccountAddresses()
  const { status } = useExtensionAutoConnect()

  const totalNFTs = useFetchNFTs()
  const addressesLoading = addresses === undefined
  const nftLoading = totalNFTs === undefined
  const hasNfts = totalNFTs?.length > 0

  const [nft, setNft] = useState<NFTConsolidated>()

  // Set default NFT
  useEffect(() => {
    if (hasNfts && !nft) {
      setNft(totalNFTs[0])
    }
  }, [hasNfts, nft, totalNFTs])

  // Switch the current nft they're viewing
  function changeNFT(direction: number) {
    if (direction > 0 && currentNFT + 1 < totalNFTs.length) {
      setCurrentNFT(currentNFT + 1)
      setNft(totalNFTs[currentNFT + 1])
    } else if (currentNFT - 1 >= 0 && direction === 0) {
      setCurrentNFT(currentNFT - 1)
      setNft(totalNFTs[currentNFT - 1])
    }
  }

  if (addressesLoading) {
    return <StyledLoader />
  }

  return (
    <section className={className}>
      {isMobileBrowser() && <DesktopRequired />}
      <div className="content">
        <img src={bannerImage} alt="Unlock the Paraverse" width="100%" />
        <h2 style={{ padding: '0 10vw 5vw', color: 'var(--color-foreground)' }}>
          Discover a Spirit Key to get access to special perks and be among the first to try the Talisman wallet
          extension
        </h2>
        {status === 'OK' && nftLoading && <StyledLoader />}
        {!nftLoading && (
          <h2 style={{ textAlign: 'center' }}>
            You have {hasNfts ? <span style={{ color: 'var(--color-primary' }}>{totalNFTs.length}</span> : 'no'} Spirit
            Key{totalNFTs.length === 1 ? '' : 's'}
          </h2>
        )}
        <SpiritKeyNft src={hasNfts ? nft?.image?.replace('ipfs://', 'https://rmrk.mypinata.cloud/') : baseImage} />
        {(status !== 'OK' || totalNFTs?.length < 1) && (
          <div className="empty-state-buttons-div">
            <JoinButton className="join-discord-button" />
            <Button to="/crowdloans" className="explore-crowdloans-button">
              Explore Crowdloans
            </Button>
          </div>
        )}
        {hasNfts && (
          <div className="spirit-key-body">
            <a
              href={TALISMAN_EXTENSION_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={e => {
                trackGoal('TE3SATFD', 0) // alpha_downloads
              }}
            >
              <Button primary className="unlock-alpha">
                Unlock the Alpha
              </Button>
            </a>
            <div className="switcher">
              <Button.Icon
                className="nav-toggle-left"
                onClick={(e: any) => {
                  changeNFT(0)
                }}
              >
                <ChevronDown />
              </Button.Icon>
              <div className="nft-number" style={{ color: 'var(--color-text)' }}>
                <p>#{totalNFTs[currentNFT]?.sn.substring(4)}</p>
              </div>
              <Button.Icon
                className="nav-toggle-right"
                onClick={(e: any) => {
                  changeNFT(1)
                }}
              >
                <ChevronDown />
              </Button.Icon>
            </div>
            <h2>Send to a friend</h2>
            <SendNft nft={nft} />
          </div>
        )}

        <div className="info">
          <div className="section">
            <h2>How do I get one?</h2>
            <p>Keys have been seen in various locations, but never for very long. The best places to find them are:</p>
            <ul>
              <li>The Talisman Discord Server</li>
              <li>Various DotSama communities</li>
              <li>Contribute to Crowdloans during the Spirit Hour</li>
            </ul>
          </div>
          <div className="section">
            <h2>Benefits</h2>
            <p>Become a Paraverse explorer and gain special access to a variety of perks including:</p>
            <ul>
              <li>Participate in the Talisman Wallet Alpha release</li>
              <li>Join the Spirit Clan channel in our Discord server</li>
              <li>Get early access to new features on the Talisman web app</li>
            </ul>
          </div>
        </div>
        <article>
          <h1>
            <li>Talisman Seeker, it's your spirit that's key.</li>
            <li>At the end of your seeking, you'll finally be free.</li>
            <li>A key to the new world is a difficult thing.</li>
            <li>You should ask yourself honestly, "what on earth should I bring?"</li>
            <li>Give a moment of thought as to whether it can be brought.</li>
            <li>All I can guarantee, is that nothing is for naught.</li>
          </h1>
        </article>
      </div>
    </section>
  )
})`
  .unlock-alpha {
    margin: 2rem;
  }

  h2 {
    color: var(--color-text);
  }

  > .content {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;

    padding: 0 5vw;
    display: flex;
    justify-content: center;
    z-index: 1;
    position: relative;
    flex-direction: column;

    > .empty-state-buttons-div {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
      align-items: center;
      margin: 1.3rem auto 3.2rem auto;

      .join-discord-button {
        width: 22.9rem;
        height: 5.6rem;
        background-color: var(--color-background);
        border-style: solid;
        border-width: 1px;
        border-color: #ffffff;
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
      }
      .explore-crowdloans-button {
        width: 22.9rem;
        height: 5.6rem;
        background-color: var(--color-primary);
        border-style: none;
        color: #000000;
        font-size: 16px;
        font-weight: 400;
      }
    }

    p {
      margin: 2rem auto;
    }

    > .spirit-key-body {
      display: flex;
      flex-direction: column;
      align-items: center;

      > .switcher {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.4rem auto 4rem;

        .nav-toggle-left {
          width: 5rem;
          height: 5rem;
          background: none;
          margin-right: 1rem;
          transform: rotate(90deg);
        }

        .nav-toggle-right {
          width: 5rem;
          height: 5rem;
          background: none;
          margin-left: 1rem;
          transform: rotate(-90deg);
        }

        .nft-number {
          background: #262626;
          border-radius: 1rem;
          padding: 1rem;
        }

        p {
          margin: 0;
        }
      }
      .address-input-title {
        margin: 5.6rem auto 0 auto;
      }

      > .address-input-container {
        margin: 3.2rem auto;
        align-items: center;
        height: 56px;
        display: flex;

        > input {
          background-color: var(--color-background);
          border-radius: 1.2rem;
          border-style: solid;
          border-width: 1px;
          border-color: #5a5a5a;
          height: 56px;
          width: 519px;
          padding-left: 1.6rem;

          ::placeholder {
            color: #a5a5a5;
            font-size: 1em;
          }
        }

        button {
          background-color: var(--color-primary);
          height: 56px;
          width: 135px;
          border-radius: 1.2rem;
          margin: 0px 0px 0px -135px;
          border-style: none;
          color: #000000;
          cursor: pointer;
        }
      }
    }

    > .info {
      display: flex;
      felx-direction: row;
      width: 90%;
      margin: 4.8rem auto 9.6rem auto;
      gap: 2.5rem;

      .section {
        background-color: #262626;
        padding: 2.4rem;
        border-radius: 1.2rem;
        flex-basis: 100%;
        font-family: 'Surt';
      }
    }

    > article {
      width: 80%;
      color: var(--color-text);
      text-align: center;
      margin: 6rem auto 0 auto;

      h1 {
        font-family: 'ATApocRevelations', sans-serif;
        font-size: 4rem;
        font-weight: 400;
        list-style-type: none;
      }
    }
  }
`

export default SpiritKey
