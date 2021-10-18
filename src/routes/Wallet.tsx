import { Account, Wallet } from '@archetypes'
import { StateBanner } from '@archetypes/StateBanner'
import { DesktopRequired } from '@components'
import { device } from '@util/breakpoints'
import styled from 'styled-components'

const _Wallet = styled(({ className }) => (
  <section className={className}>
    <DesktopRequired />
    <Account.Button allAccounts />
    <header>
      <Wallet.Total />
      <StateBanner />
    </header>
    <Wallet.Assets />
    <Wallet.Crowdloans />
    <Wallet.Staking />
  </section>
))`
  margin: 0 auto;
  width: 100%;
  max-width: calc(92rem + 6vw);
  padding: 0 3vw;
  margin: 6rem auto;

  > * {
    margin-bottom: 3.25vw;
  }

  > header {
    > * + * {
      margin-top: 1rem;
    }
    @media ${device.lg} {
      display: flex;
      gap: 2rem;
      > * + * {
        margin-top: 0;
      }
    }
  }
`

export default _Wallet
