import Logo from '@components/Logo'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'

import Features from './Features'
import Footer from './Footer'

const containerStyles = css`
  display: grid;
  grid-template-rows: auto auto auto auto 1fr;
  justify-items: center;
  align-content: start;
  text-align: center;
  height: 100%;
`

const Landing = () => (
  <div className={containerStyles}>
    <header
      className={css`
        display: grid;
        margin-top: 40px;
      `}
    >
      <Logo
        className={css`
          width: 133px;
          height: auto;
        `}
      />
    </header>
    <h1
      className={css`
        font-family: 'SurtExt';
        color: var(--color-offWhite);
        font-weight: 600;
        text-align: center;
        max-width: 1000px;
        font-size: 48px;
        line-height: 64px;
        margin-top: 96px;
        @media ${device.lg} {
          font-size: 64px;
          line-height: 120%;
          margin-top: 80px;
        }
      `}
    >
      Everything you need to run your onchain organisation
    </h1>
    <div
      className={css`
        margin-top: 77px;
        @media ${device.lg} {
          margin-top: 70px;
        }
      `}
    >
      <Features />
    </div>
    <section
      className={css`
        display: grid;
        grid-template-rows: 56px 46px;
        margin-top: 39px;
        @media ${device.lg} {
          margin-top: 80px;
        }
        align-items: end;
      `}
    >
      <div
        className={css`
          display: grid;
          background: var(--color-primary);
          height: 56px;
          width: 240px;
          color: black;
          border-radius: 12px;
          justify-content: center;
          align-content: center;
          cursor: pointer;
        `}
      >
        <h3>Connect Wallet</h3>
      </div>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        <p
          className={css`
            font-size: 16px;
            line-height: 140%;
            color: #9d9d9d;
          `}
        >
          Learn more
        </p>
      </a>
    </section>
    <div
      className={css`
        padding-top: 160px;
        margin-top: auto;
        align-self: end;
        @media ${device.lg} {
          padding-top: 176px;
        }
      `}
    >
      <Footer />
    </div>
  </div>
)

export default Landing
