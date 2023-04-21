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
        a {
          color: var(--color-offWhite);
          font-size: 14px;
        }
        @media ${device.lg} {
          padding: 0 96px;
        }
      `}
    >
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        FAQ
      </a>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        Docs
      </a>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        Twitter
      </a>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        Discord
      </a>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        Terms
      </a>
      <a href="https://talisman.xyz" target="_blank" rel="noreferrer">
        Privacy Policy
      </a>
      <a
        href="https://talisman.xyz"
        target="_blank"
        className={css`
          flex-grow: 1;
          margin-left: auto;
          text-align: right;
          color: var(--color-foreground) !important;
          color: red;
        `}
        rel="noreferrer"
      >
        {'Made with ♥️ by Talisman'}
      </a>
    </footer>
  )
}

export default Footer
