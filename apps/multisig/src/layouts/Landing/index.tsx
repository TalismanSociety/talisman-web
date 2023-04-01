import Logo from '@components/Logo'
import { css } from '@emotion/css'

import Features from './Features'
import Footer from './Footer'

const containerStyles = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 80px 234px 364px 182px 360px;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  justify-items: center;
  text-align: center;
`

const Landing = () => (
  <div className={containerStyles}>
    <header
      className={css`
        margin: auto;
        display: grid;
        margin-top: 40px;
      `}
    >
      <Logo />
    </header>
    <h1
      className={css`
        font-family: 'Standard';
        color: var(--color-offWhite);
        text-align: center;
        max-width: 1000px;
        font-size: 60px;
        line-height: 120%;
        margin-top: 80px;
      `}
    >
      Everything you need to run your onchain organisation
    </h1>
    <Features />
    <section
      className={css`
        display: grid;
        grid-template-rows: 56px 46px;
        margin-top: 80px;
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
    <Footer />
  </div>
)

export default Landing
