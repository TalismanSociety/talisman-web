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
  width: 100%;
  padding: 0 6vw;
  margin: 6rem auto;

  > * {
    margin-bottom: 3.25vw;
  }

  > header {
    display: flex;
    align-items: center;
    flex-wrap: wrap-reverse;
    margin-bottom: 6rem;
    > * + * {
      margin-bottom: 2rem;
    }
    @media ${device.xxl} {
      gap: 2rem;
      flex-wrap: nowrap;
      > * + * {
        margin-top: 0;
      }
    }
  }
`

export default _Wallet
