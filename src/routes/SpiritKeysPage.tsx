import { Button, DesktopRequired, Field } from '@components'
import { StyledLoader } from '@components/Await'
import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import { useAccountAddresses, useExtensionAutoConnect } from '@libs/talisman'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { encodeAnyAddress } from '@talismn/util'
import { isMobileBrowser } from '@util/helpers'
import { useEffect, useMemo, useState } from 'react'
import { consolidatedNFTtoInstance } from 'rmrk-tools'
import { NFTConsolidated } from 'rmrk-tools/dist/tools/consolidator/consolidator'
import styled from 'styled-components'

import { fetchNFTData } from '../libs/spiritkey/spirit-key'

const isValidAddress = (address: string) => {
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
  const accountAddresses = useAccountAddresses()
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

async function setupRemark(nftObject: NFTConsolidated, toAddress: string) {
  if (!toAddress) {
    return undefined
  }
  const nft = consolidatedNFTtoInstance(nftObject)
  const remark = await nft?.send(toAddress)
  return remark
}

async function setupInjector(nftObject: NFTConsolidated) {
  if (!nftObject) {
    return undefined
  }
  const injector = await web3FromAddress(nftObject?.account)
  return injector
}

function useNftRemark(nftObject: NFTConsolidated, toAddress: string) {
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

const sendNFT = async (api: ApiPromise, nftObject: any, remark: string, injector: any) => {
  const txs = [api.tx.system.remark(remark)]
  const tx = api.tx.utility.batchAll(txs)
  const txSigned = await tx.signAsync(nftObject?.account, { signer: injector.signer })

  const unsub = await txSigned.send(async result => {
    console.log(`>>> aaa`, result)
    const { status, events = [], dispatchError } = result

    for (const {
      phase,
      event: { data, method, section },
    } of events) {
      console.info(`\t${phase}: ${section}.${method}:: ${data}`)
    }

    if (status.isInBlock) {
      console.info(`Transaction included at blockHash ${status.asInBlock}`)
    }
    if (status.isFinalized) {
      console.info(`Transaction finalized at blockHash ${status.asFinalized}`)
      unsub()

      let txStatus = 'FAILED'
      if (
        events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicSuccess') &&
        !events.some(({ event: { method, section } }) => section === 'system' && method === 'ExtrinsicFailed')
      ) {
        txStatus = 'SUCCESS'
      }

      if (dispatchError && dispatchError.isModule && api) {
        const decoded = api.registry.findMetaError(dispatchError.asModule)
        const { docs, name, section } = decoded
        console.log('error', `${section}.${name}: ${docs.join(' ')}`)
      } else if (dispatchError) {
        console.log('error', dispatchError.toString())
      }
      console.log(txStatus)
    }
  })
}

const SendAsset = styled(({ className, nft }) => {
  const [toAddress, setToAddress] = useState<string>('')
  const api = useSender()
  const remark = useNftRemark(nft, toAddress)
  const injector = useInjector(nft)

  if (!api) {
    return <StyledLoader />
  }

  return (
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
        onClick={async (e: any) => {
          await sendNFT(api, nft, remark, injector)
        }}
      >
        Send
      </Button>
    </div>
  )
})`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > .field {
    width: 50%;
  }
`

const SpiritKey = styled(({ className }) => {
  const baseImage = 'https://rmrk.mypinata.cloud/ipfs/bafybeicuuasrqnqndfw3k6rqacfpfil5sc5fhyjh63riqnd2imm5eucrk4'
  const [currentNFT, setCurrentNFT] = useState<number>(0)
  useExtensionAutoConnect()

  const totalNFTs = useFetchNFTs()
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

  console.log(`>>> aaa`, totalNFTs)
  if (totalNFTs === undefined) {
    return <StyledLoader />
  }

  return (
    <section className={className}>
      {isMobileBrowser() && <DesktopRequired />}
      <div className="content">
        <img
          className="spirit-key-image"
          src={hasNfts ? nft?.image?.replace('ipfs://', 'https://rmrk.mypinata.cloud/') : baseImage}
          alt="Spirit Key"
        />
        <p>You have {hasNfts ? totalNFTs.length : 'no'} Spirit Keys</p>
        {totalNFTs.length < 1 && (
          <div className="empty-state-buttons-div">
            <a href="https://discord.gg/jTzkMY9Y" target="_blank" rel="noreferrer noopener">
              <Button className="join-discord-button"> Join Discord</Button>
            </a>
            <Button to="/crowdloans" className="explore-crowdloans-button">
              {' '}
              Explore Crowdloans{' '}
            </Button>
          </div>
        )}
        {hasNfts && (
          <div className="spirit-key-body">
            <div className="switcher">
              <Button.Icon
                className="nav-toggle-left"
                onClick={(e: any) => {
                  changeNFT(0)
                }}
              >
                <ChevronDown />
              </Button.Icon>
              <div className="nft-number">
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
            <SendAsset nft={nft} />
          </div>
        )}

        <div className="info">
          <div className="section">
            <h2>How do I get one?</h2>
            <p>Keys have been seen in various location, but never for very long. The best places to find them are:</p>
            <ul>
              <li>The Talisman Discord Server</li>
              <li>Various DotSama communities</li>
              <li>Contribute to Crowdloans during the Spirit Hour(See Twitter for more info)</li>
            </ul>
          </div>
          <div className="section">
            <h2>Benefits?</h2>
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
            Talisman Seeker, it's your spirit that's key. At the end of your seeking, you'll finally be free. A key to
            the new world is a difficult thing. You should ask yourself honestly, "what on earth should I bring?" Give a
            moment of thought as to whether it can be brought. All I can guarantee, is that nothing is for naught.
          </h1>
        </article>
      </div>
    </section>
  )
})`
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

    .spirit-key-image {
      width: 316px;
      height: 316px;
      margin: 4rem auto 2rem auto;
      border-radius: 2rem;
      object-fit: cover;
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
      width: 75%;
      color: var(--color-text);
      text-align: center;
      margin: 6rem auto 0 auto;

      h1 {
        font-family: 'ATApocRevelations', sans-serif;
        font-size: 4rem;
        font-weight: 400;
      }
    }
  }
`

export default SpiritKey
