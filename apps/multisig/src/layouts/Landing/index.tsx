import Logo from '@components/Logo'
import { accountsState, extensionAllowedState, extensionLoadingState } from '@domains/extension'
import { activeMultisigsState } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { device } from '@util/breakpoints'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'

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

const Landing = () => {
  const [extensionAccounts] = useRecoilState(accountsState)
  const [extensionLoading] = useRecoilState(extensionLoadingState)
  const [extensionAllowed] = useRecoilState(extensionAllowedState)
  const [allowExtension, setAllowExtension] = useRecoilState(extensionLoadingState)
  const activeMultisigs = useRecoilValue(activeMultisigsState)
  const navigate = useNavigate()

  console.log({
    extensionAccounts,
    extensionLoading,
    allowExtension,
    activeMultisigs,
  })

  // Handle redirecting once account/s are connected
  useEffect(() => {
    if (!allowExtension || extensionLoading || extensionAccounts.length === 0) return
    if (activeMultisigs.length > 0) {
      navigate('/overview')
    } else {
      navigate('/create')
    }
  }, [extensionAccounts, activeMultisigs, navigate, extensionLoading, allowExtension])

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
        `}
      >
        <Button
          className={css`
            width: 240px;
            height: 56px;
          `}
          children={
            !allowExtension ? (
              <h3>Connect Wallet</h3>
            ) : extensionLoading ? (
              <h3>Loading...</h3>
            ) : (
              <h3>No Accounts Connected</h3>
            )
          }
          onClick={() => {
            setAllowExtension(true)
          }}
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
