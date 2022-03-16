import nftRowSkeleton from '@assets/nft-row-skeleton.png'
import { Button, ExtensionStatusGate, PanelSection } from '@components'
import NFTsByAddress from '@components/NFTsByAddress'
import { Placeholder } from '@components/Placeholder'
import { Account as IAccount, useExtensionAutoConnect } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { useNfts, useNftsByAddress } from '@talisman-components/nft'
import { device } from '@util/breakpoints'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface AccountProps {
  className?: string
  account: IAccount
}

const ExtensionUnavailable = styled(props => {
  const { t } = useTranslation()
  return (
    <PanelSection comingSoon {...props}>
      <p>{t('extensionUnavailable.subtitle')}</p>
      <p>{t('extensionUnavailable.text')}</p>
    </PanelSection>
  )
})`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  > h2 {
    color: var(--color-text);
    font-weight: 600;
    font-size: 1.8rem;
  }
  p {
    color: #999;
    font-size: 1.6rem;
  }
`

const NFTGrid = styled(({ className = '', account }: AccountProps) => {
  const { address, name, type } = account
  const { nfts } = useNftsByAddress(address as string)
  if (!nfts?.length) {
    return null
  }
  return (
    <div className={className}>
      <div className="account-name">
        <Identicon
          className="identicon"
          size={64}
          value={address}
          theme={type === 'ethereum' ? 'ethereum' : 'polkadot'}
        />
        <span>{name}</span>
      </div>
      <div className="nft-grid">
        <NFTsByAddress address={address} />
      </div>
    </div>
  )
})`
  .account-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .identicon {
    svg {
      width: 2.5em;
      height: 2.5em;
    }

    > * {
      line-height: 0;
    }
  }

  .nft-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;

    @media ${device.md} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media ${device.lg} {
      grid-template-columns: repeat(3, 1fr);
    }

    @media ${device.xl} {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`

const NoNFTs = () => {
  const { t } = useTranslation('banners')
  return (
    <Placeholder placeholderImage={nftRowSkeleton}>
      <div className="description">{t('noNfts.description')}</div>
      <div className="cta">
        <Button className="outlined">{t('noNfts.primaryCta')}</Button>
      </div>
    </Placeholder>
  )
}

const NFTsPage = styled(({ className }) => {
  const { accounts } = useExtensionAutoConnect()
  const addresses = accounts.map(account => account.address)
  const { nfts, isLoading } = useNfts(addresses, { limitPerAddress: 1 })

  console.log(`>>> nfts`, nfts, addresses)

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <ExtensionStatusGate unavailable={<ExtensionUnavailable />}>
        <div className="all-nft-grids">
          {nfts && nfts?.length === 0 && !isLoading && <NoNFTs />}
          {nfts &&
            nfts?.length > 0 &&
            accounts?.map(account => {
              return <NFTGrid key={account.address} account={account} />
            })}
        </div>
      </ExtensionStatusGate>
    </section>
  )
})`
  color: var(--color-text);
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;

  .all-nft-grids > * + * {
    margin-top: 4rem;
  }
`

export default NFTsPage
