import { Account } from '@archetypes'
import { CopyButton } from '@components/CopyButton'
import NFTsByAddress from '@components/NFTsByAddress'
import { useExtensionAutoConnect } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

const NFTsPage = styled(({ className }) => {
  const { accounts } = useExtensionAutoConnect()

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <Account.Button allAccounts />
      <div className="all-nft-grids">
        {accounts?.map(({ address, name }) => {
          return (
            <div key={address}>
              <div className="account-name">
                <Identicon className="identicon" size={64} value={address} />
                <span>{name}</span>
                <span className="copy-button">
                  <CopyButton text={address} />
                </span>
              </div>
              <div className="nft-grid">
                <NFTsByAddress address={address} />
              </div>
            </div>
          )
        })}
      </div>
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
    margin-top: 2rem;
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

  .account-picker {
    margin-bottom: 4rem;
    position: absolute;
    top: 100%;
    left: 0;
  }

  .account-switcher-pill {
    margin-bottom: 4rem;
  }

  .account-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .nft-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr 1fr;

    @media ${device.lg} {
      grid-template-columns: repeat(3, 1fr);
    }

    @media ${device.xl} {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`

export default NFTsPage
