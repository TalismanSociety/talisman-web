import { css } from '@emotion/css'
import { device } from '@util/breakpoints'

const Footer = () => {
  return (
    <footer
      className={css`
        grid-area: footer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 18px;
        padding: 0 40px;
        padding-bottom: 16px;
        p {
          font-size: 14px;
        }
        a {
          color: var(--color-offWhite);
          font-size: 14px;
        }
        @media ${device.lg} {
          padding: 0 96px;
          padding-bottom: 16px;
        }
      `}
    >
      <p>Signet (Beta)</p>
      <a href="https://twitter.com/wearetalisman" target="_blank" rel="noreferrer">
        Twitter
      </a>
      <a href="https://discord.gg/talisman" target="_blank" rel="noreferrer">
        Discord
      </a>
      <a
        href="https://docs.talisman.xyz/talisman/prepare-for-your-journey/terms-of-use"
        target="_blank"
        rel="noreferrer"
      >
        Terms
      </a>
      <a
        href="https://docs.talisman.xyz/talisman/prepare-for-your-journey/privacy-policy"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
      <div
        className={css`
          margin-left: auto;
          > a {
            color: var(--color-foreground) !important;
          }
          > a:first-child {
            background: linear-gradient(90deg, #ed726d, #ee94f9);
            background-clip: text;
            -webkit-background-clip: text;
          }
          > a:last-child {
            background: linear-gradient(90deg, #918ff8, #cefd9c);
            background-clip: text;
            -webkit-background-clip: text;
          }
          :hover {
            > a {
              font-size: 16px;
              transition: 300ms ease-in-out;
            }
            > a:first-child,
            > a:last-child {
              color: transparent !important;
            }
          }
        `}
      >
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          {'Made with'}
        </a>
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          {' ♥️ '}
        </a>
        <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
          {'by Talisman'}
        </a>
      </div>
    </footer>
  )
}

export default Footer
