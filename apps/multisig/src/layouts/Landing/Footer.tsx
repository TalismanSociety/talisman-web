import DiscordLogo from '@components/DiscordLogo'
import GithubLogo from '@components/GithubLogo'
import Logo from '@components/Logo'
import TalismanLogo from '@components/TalismanLogo'
import TwitterLogo from '@components/TwitterLogo'
import W3FLogo from '@components/W3FLogo'
import { css } from '@emotion/css'
import { device } from '@util/breakpoints'

const MiscLinks = () => {
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-width: 242px;
        gap: 67px;
      `}
    >
      <div
        className={css`
          display: grid;
          justify-items: start;
          gap: 15px;
          color: var(--color-offWhite);
        `}
      >
        <p>Partners</p>
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          <TalismanLogo />
        </a>
        <a href="https://web3.foundation/" target="_blank" rel="noreferrer">
          <W3FLogo />
        </a>
      </div>
      <div
        className={css`
          display: grid;
          justify-items: start;
          color: var(--color-offWhite);
          grid-template-rows: 20px 20px 18px;
          gap: 18px;
        `}
      >
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          <p>Docs</p>
        </a>
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          <p>FAQ</p>
        </a>
        <div
          className={css`
            display: grid;
            gap: 16px;
            justify-content: start;
            align-items: center;
            grid-template-columns: 1fr 1fr 1fr;
          `}
        >
          <a href="https://discord.gg/talisman" target="_blank" rel="noreferrer">
            <DiscordLogo />
          </a>
          <a href="https://twitter.com/wearetalisman" target="_blank" rel="noreferrer">
            <TwitterLogo />
          </a>
          <a href="https://github.com/TalismanSociety/talisman-web" target="_blank" rel="noreferrer">
            <GithubLogo />
          </a>
        </div>
      </div>
    </div>
  )
}

const Footer = () => {
  return (
    <footer
      className={css`
        display: grid;
        background-color: var(--color-backgroundSecondary);
        width: 100vw;
        justify-content: center;
        @media ${device.sm} {
          height: 246px;
          height: 246px;
        }
        @media ${device.md} {
          height: 164px;
        }
      `}
    >
      <div
        className={css`
          display: grid;
          align-content: center;
          margin: 32px 48px;
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;
          gap: 32px;
          max-width: 360px;
          @media ${device.sm} {
            max-width: 100%;
            gap: 48px 84px;
            margin: 32px 64px;
            grid-template-columns: 266px 242px;
            grid-template-rows: 100px 1fr;
          }
          @media ${device.md} {
            gap: 80px;
            grid-template-columns: auto 317px 242px;
            grid-template-rows: auto;
          }
          @media ${device.lg} {
            padding-right: 255px;
            grid-template-columns: auto 330px 242px;
            margin-left: 120px;
            gap: 35px;
          }
        `}
      >
        <Logo
          className={css`
            margin-right: auto;
            width: 266px;
            height: auto;
            @media ${device.lg} {
              width: 333px;
            }
          `}
        />
        <p
          className={css`
            text-align: left;
            color: var(--color-offWhite);
            margin: auto;
            grid-row: 3;
            @media ${device.sm} {
              grid-column: 1 / -1;
              grid-row: 2;
            }
            @media ${device.md} {
              grid-row: 1;
              grid-column: 2;
            }
          `}
        >
          Signet is the all-in-one solution for creating and managing onchain organisations. An easy to use multi-sig
          wallet designed for teams who value security and efficiency.
        </p>
        <MiscLinks />
      </div>
    </footer>
  )
}

export default Footer
