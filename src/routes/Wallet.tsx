import { Wallet } from '@archetypes'
import { DesktopRequired } from '@components'
import styled from '@emotion/styled'
import { StateBanner } from '@layout/StateBanner'
import { device } from '@util/breakpoints'
import { isMobileBrowser } from '@util/helpers'

const _Wallet = styled(({ className }) => {
  return (
    <section className={className}>
      {isMobileBrowser() && <DesktopRequired />}
      <header>
        <div className="account-overview">
          <Wallet.Total />
        </div>
        <div className="banner">
          <StateBanner />
        </div>
      </header>
      <Wallet.Assets />
      <Wallet.NFTs />
    </section>
  )
})`
  width: 100%;
  max-width: 1280px;
  margin: 3rem auto;
  @media ${device.xl} {
    margin: 6rem auto;
  }
  padding: 0 2.4rem;

  > * + * {
    margin-top: 6rem;
  }

  .account-overview {
    display: flex;
    flex-wrap: wrap-reverse;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex: 1;

    @media ${device.xxl} {
      width: auto;
      display: flex;
      flex-direction: column-reverse;
      align-items: start;
    }
  }

  .banner {
    min-width: 70%;
    flex: 5;
  }

  > header {
    display: flex;
    gap: 4rem;
    flex-wrap: wrap-reverse;
    align-items: center;
    margin-bottom: 4rem;
  }
`

export default _Wallet
