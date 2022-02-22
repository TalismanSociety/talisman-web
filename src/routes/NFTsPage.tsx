import { Account } from '@archetypes'
import NFTsByAddress from '@components/NFTsByAddress'
import { useAllAccountAddresses } from '@libs/talisman'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

const NFTsPage = styled(({ className }) => {
  const addresses = useAllAccountAddresses()

  return (
    <section className={className}>
      <h1>NFTs</h1>
      <div className="account-selector">
        <Account.Button allAccounts />
      </div>
      {addresses?.map(address => {
        return (
          <div key={address}>
            <p>{address}</p>
            <div className="nft-grid">
              <NFTsByAddress address={address} />
            </div>
          </div>
        )
      })}
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

  > * + * {
    margin-top: 2rem;
  }

  .account-selector {
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
