import Logo from '@components/Logo'
import { accountsState, extensionAllowedState, extensionLoadingState } from '@domains/extension'
import { css } from '@emotion/css'
import { keyframes } from '@emotion/react'
import { Loader } from '@talismn/icons'
import { Button } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

import Features from './Features'
import Footer from './Footer'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const containerStyles = css`
  display: grid;
  grid-template-rows: auto auto auto auto 1fr;
  justify-items: center;
  align-content: start;
  text-align: center;
  height: 100%;
`

const Landing: React.FC<{ disableRedirect?: boolean }> = ({ disableRedirect }) => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const [extensionLoading] = useRecoilState(extensionLoadingState)
  const [extensionAllowed, setExtensionAllowed] = useRecoilState(extensionAllowedState)

  if (!disableRedirect && extensionAccounts.length > 0) {
    return <Navigate to="/overview" />
  }

  return (
    <div className={containerStyles}>
      <header>
        <Logo
          className={css`
            margin-top: 40px;
            width: 133px;
          `}
        />
      </header>
      <h1
        className={css`
          font-family: 'SurtExt';
          color: var(--color-offWhite);
          font-weight: 600;
          text-align: center;
          max-width: 327px;
          line-height: auto;
          margin-top: 64px;
          font-size: 32px;
          @media ${device.sm} {
            max-width: 567px;
          }
          @media ${device.md} {
            font-size: 48px;
            line-height: 64px;
            max-width: 1000px;
            margin-top: 96px;
          }
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
          margin-top: 57px;
          @media ${device.md} {
            margin-top: 77px;
          }
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
          margin-top: 47px;
          @media ${device.lg} {
            margin-top: 39px;
          }
          @media ${device.lg} {
            margin-top: 80px;
          }
          align-items: end;
          button {
            display: flex;
            align-items: center;
            justify-content: center;
            svg {
              animation: ${spin} 5s linear infinite;
              color: var(--color-background);
            }
          }
        `}
      >
        <Button
          className={css`
            width: 240px;
            height: 56px;
          `}
          children={
            !extensionAllowed ? <h3>Connect Wallet</h3> : extensionLoading ? <Loader /> : <h3>No Accounts Connected</h3>
          }
          onClick={() => {
            setExtensionAllowed(true)
          }}
          disabled={extensionAllowed && !extensionLoading && extensionAccounts.length === 0}
        />
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          <p
            className={css`
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
          width: 100%;
          @media ${device.lg} {
            padding-top: 176px;
          }
        `}
      >
        <Footer />
      </div>
    </div>
  )
}

export default Landing
