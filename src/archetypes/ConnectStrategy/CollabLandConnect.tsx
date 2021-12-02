import { Button } from '@components'
import { useFetchNFTs } from '@libs/spiritkey/spirit-key'
import { useExtensionAutoConnect } from '@libs/talisman'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { cryptoWaitReady } from '@polkadot/util-crypto'
import { web3FromAddress } from '@talismn/dapp-connect'
import { SS58Format, convertAnyAddress } from '@util/useAnyAddressFromClipboard'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ConnectStrategyProps } from './types'

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

function generateSignedUrl(urlParams: URLSearchParams, referrer: string, signature: string | undefined) {
  return `${referrer}polkadotjs?${urlParams.toString()}&token=${signature}`
}

interface ConnectItemProps {
  name?: string
  url?: string
  onClick: () => void
}

const ConnectItem = styled(({ url, name, onClick, className }) => {
  return (
    <div className={className}>
      {url ? (
        <a href={url}>Click to finish setup for {name}</a>
      ) : (
        <Button primary small onClick={onClick}>
          {`Setup ${name}`}
        </Button>
      )}
    </div>
  )
})<ConnectItemProps>`
  a {
    text-decoration: underline;
  }
`

export const CollabLandConnect = styled(({ className, referrer, urlParams }) => {
  const { accounts } = useExtensionAutoConnect()
  const [signatures, setSignature] = useState<Record<string, string | undefined>>({})
  const totalNFTs = useFetchNFTs()
  const api = useSender()

  const onSign = (ownerAddress: string) => async () => {
    const injector = await web3FromAddress(ownerAddress)
    const payload = { data: urlParams.get('stateId') || '' }
    const signature = await api?.sign(ownerAddress, payload, { signer: injector.signer })
    setSignature({
      ...signatures,
      [ownerAddress]: signature,
    })
  }

  console.log(`>>> alala`, referrer)

  if (!accounts || totalNFTs === undefined) {
    return <div className={className}>Loading...</div>
  }

  if (!referrer) {
    return <div className={className}>Get a new CollabLand link via Discord !join command.</div>
  }

  return (
    <div className={className}>
      <h1>Accounts with Spirit Keys</h1>
      {accounts.map(account => {
        const ownerAddress = convertAnyAddress(account.address, SS58Format.Kusama) as string
        const spiritKeys = totalNFTs.filter(nft => {
          const kusamaAddress = convertAnyAddress(nft.owner, SS58Format.Kusama)
          return ownerAddress === kusamaAddress
        })
        const generatedUrl = signatures[ownerAddress]
          ? generateSignedUrl(urlParams, referrer, signatures[ownerAddress])
          : undefined
        if (!spiritKeys.length) {
          return null
        }
        return (
          spiritKeys.length && (
            <ConnectItem
              key={account.address}
              url={generatedUrl}
              name={account.name}
              onClick={onSign(ownerAddress as string)}
            />
          )
        )
      })}
    </div>
  )
})<ConnectStrategyProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > * + * {
    margin-top: 1.5rem;
  }
`
