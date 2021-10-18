import { Account, Wallet } from '@archetypes'
import { DesktopRequired } from '@components'
import styled from 'styled-components'

const _Wallet = styled(({ className }) => (
  <section className={className}>
    <DesktopRequired />
    <header>
      <Wallet.Total />
      <Account.Button allAccounts />
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
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
`

export default _Wallet
