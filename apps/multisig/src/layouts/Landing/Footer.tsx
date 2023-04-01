import DiscordLogo from '@components/DiscordLogo'
import GithubLogo from '@components/GithubLogo'
import Logo from '@components/Logo'
import TalismanLogo from '@components/TalismanLogo'
import TwitterLogo from '@components/TwitterLogo'
import W3FLogo from '@components/W3FLogo'
import { css } from '@emotion/css'

const MiscLinks = () => {
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
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
        margin-top: 176px;
        padding-left: 120px;
        background-color: var(--color-backgroundSecondary);
        width: 100%;
        grid-template-columns: 332px 330px 242px;
        gap: 80px;
        align-content: center;
      `}
    >
      <Logo height="100px" />
      <p
        className={css`
          text-align: left;
          color: var(--color-offWhite);
          margin: auto;
        `}
      >
        Signet is the all-in-one solution for creating and managing onchain organisations. An easy to use multi-sig
        wallet designed for teams who value security and efficiency.
      </p>
      <MiscLinks />
    </footer>
  )
}

export default Footer
