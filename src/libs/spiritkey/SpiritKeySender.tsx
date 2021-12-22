import { JoinButton } from '@archetypes/JoinButton/JoinButton'
import { Button, Field, useModal } from '@components'
import { LeftRightPicker } from '@components/LeftRightPicker'
import { TalismanHandLike } from '@components/TalismanHandLike'
import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { useExtensionAutoConnect } from '@libs/talisman'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { hexToU8a, isHex } from '@polkadot/util'
import { cryptoWaitReady, decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { web3FromAddress } from '@talismn/dapp-connect'
import { AnyAddress, SS58Format, convertAnyAddress } from '@util/useAnyAddressFromClipboard'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { consolidatedNFTtoInstance } from 'rmrk-tools'
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator'
import styled from 'styled-components'

import { SpiritKeyNftImage } from './SpiritKeyNftImage'
import { useFetchNFTs } from './useFetchNFTs'

type SendStatus = 'INPROGRESS' | 'SUCCESS' | 'FAILED'

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
  const { t: t2 } = useTranslation('spirit-keys')
  return (
    <div className={className}>
      <header>
        <h2>{t('success.header')}</h2>
        <TalismanHandLike />
      </header>
      <main>
        <div>{t('success.description')}</div>
        <div style={{ fontWeight: 'bold', fontSize: 'small', color: 'var(--color-text)' }}>
          {t('willTakeFewMins', { ns: 'spirit-keys' })}
        </div>
        {explorerUrl && (
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            {t('success.primaryCta')}
          </a>
        )}
      </main>
      <footer>
        <Button primary onClick={closeModal}>
          {t2('Done')}
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

const SendNftProgress = ({ status, onClose }) => {
  if (status === 'INPROGRESS') {
    return <InProgress />
  }
  if (status === 'SUCCESS') {
    return <Success closeModal={onClose} />
  }
  return null
}

const SendNftInput = styled(({ className, onChange, onSendNft }) => {
  const { t } = useTranslation('spirit-keys')
  const [toAddress, setToAddress] = useState<AnyAddress>('')
  return (
    <div className={className}>
      <Field.Input
        value={toAddress}
        onChange={(value: string) => {
          setToAddress(value)
          if (onChange) {
            onChange(value)
          }
        }}
        dim
        type="text"
        placeholder={t('Enter Kusama Address')}
        className="toAddress"
      />
      <Button primary disabled={!isValidAddress(toAddress)} onClick={onSendNft}>
        {t('Send')}
      </Button>
    </div>
  )
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  > .field {
    width: 50%;
  }

  > button {
    max-height: 4.7rem;
    border-radius: 1rem;
  }
`

const SpiritKeySenderModal = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const [currentNFT, setCurrentNFT] = useState<number>(0)
  const { status } = useExtensionAutoConnect()
  const { closeModal } = useModal()

  const totalNFTs = useFetchNFTs()
  const hasNfts = totalNFTs?.length > 0

  const [nft, setNft] = useState<NFTConsolidated>()

  const [toAddress, setToAddress] = useState<AnyAddress>('')
  const [sendStatus, sendNft, resetStatus] = useNftSender(nft, toAddress)

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

  if (sendStatus === 'INPROGRESS' || sendStatus === 'SUCCESS') {
    return (
      <SendNftProgress
        status={sendStatus}
        onClose={() => {
          resetStatus()
          closeModal()
        }}
      />
    )
  }

  return (
    <div className={className}>
      <SpiritKeyNftImage border={false} />
      {(status !== 'OK' || totalNFTs?.length < 1) && (
        <div className="empty-state-buttons-div">
          <JoinButton className="join-discord-button" />
          <Button to="/crowdloans" className="explore-crowdloans-button">
            {t('Explore Crowdloans')}
          </Button>
        </div>
      )}
      {hasNfts && (
        <>
          <LeftRightPicker
            value={<span>#{totalNFTs[currentNFT]?.sn.substring(4)}</span>}
            onLeftPick={() => changeNFT(0)}
            onRightPick={() => changeNFT(1)}
          />
          <SendNftInput onChange={setToAddress} onSendNft={sendNft} />
          {sendStatus === 'FAILED' && <>{t('Error sending NFT')}</>}
        </>
      )}
    </div>
  )
})`
  text-align: center;
  > * + * {
    margin-top: 2rem;
  }
`

export const SpiritKeySender = styled(({ className }) => {
  const { t } = useTranslation('spirit-keys')
  const totalNFTs = useFetchNFTs()
  const hasNfts = totalNFTs?.length > 0
  const { openModal } = useModal()
  if (!hasNfts) {
    return null
  }
  return (
    <div className={className} onClick={() => openModal(<SpiritKeySenderModal />)}>
      {t('Send to a friend')}
    </div>
  )
})`
  color: var(--color-primary);
  :hover {
    cursor: pointer;
  }
`
