import '@talismn/ui/assets/css/talismn.css'

import SurtRegular from '@assets/fonts/AT_Surt_Regular.woff2'
import SurtExtendedSemiBold from '@assets/fonts/AT_Surt_SemiBold_Extd.woff2'
import SurtSemiBold from '@assets/fonts/AT_Surt_SemiBold.woff2'
import StandardBook from '@assets/fonts/standard-book-webfont.woff2'
import { Global, Theme, ThemeProvider, css } from '@emotion/react'
import { TalismanTheme, theme } from '@talismn/ui'
import { PropsWithChildren } from 'react'

declare module '@emotion/react' {
  export interface Theme extends TalismanTheme {
    // Deprecated styling
    primary: string
    secondary: string
    background: string
    backgroundLight: string
    backgroundLighter: string
    backgroundSecondary: string
    offWhite: string
    foreground: string
    mid: string
    dim: string
    light: string
    dark: string
    text: string
    activeBackground: string
    controlBackground: string
    grey800: string
  }
}

/*
  base style definitions
  allow component styling using css variables, defined below
  usage: background: var(--color-primary) or font-size: var(--font-size-large)
*/

// status color defs
const statusColors = {
  '21C91D': ['ok', 'success', 'online', 'positive'],
  'FFCF96': ['concern', 'warning'],
  'F34A4A': ['failure', 'error', 'negative'],
  'B9D9FF': ['neutral', 'default'],
}

// font size defs
const fontSizes = {
  xxxlarge: 5.6,
  xxlarge: 4,
  xlarge: 2.4,
  large: 1.8,
  normal: 1.6,
  small: 1.4,
  xsmall: 1.3,
}

// font weight defs
const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
}

// base style
export const globalStyle = (theme: Theme) => {
  return css`
    /*
      define all options as css variables
    */
    :root {
      /* theme colors as css variables */
      ${!!theme && Object.keys(theme).map(name => css`--color-${name}: rgb(${theme[name as keyof typeof theme]});`)}

      /* status color mappings */
    ${Object.keys(statusColors).map(hex =>
        statusColors[hex as keyof typeof statusColors].map(status => css`--color-status-${status}: #${hex};`)
      )}

    /* fonts size mappings */
    ${Object.keys(fontSizes).map(name => css`--font-size-${name}: ${fontSizes[name as keyof typeof fontSizes]}rem;`)}

    /* font weights */
    ${Object.keys(fontWeights).map(
        name => css`--font-weight-${name}: ${fontWeights[name as keyof typeof fontWeights]};`
      )}

    /* misc */
    --border: 0.2rem solid var(--color-dark);
      --border-radius: 1.5rem;
      --border-dashed: 0.2rem dashed var(--color-dark);
      --padding: 2.2rem 3rem;
      --padding-large: 4.2rem 4rem;
      --padding-small: 1.1rem 1.5rem;

      /* modal */
      --talisman-connect-modal-gutter: 3.4rem;
      --talisman-connect-border-radius: 2rem;
      --talisman-connect-modal-header-font-size: 2.4rem;

      --talisman-connect-control-background: #383838;
      --talisman-connect-control-foreground: inherit;
      --talisman-connect-active-background: #5a5a5a;
      --talisman-connect-active-foreground: inherit;
      --talisman-connect-modal-background: #222;
      --talisman-connect-modal-foreground: #fafafa;
      --talisman-connect-button-background: var(--talisman-connect-control-background);
      --talisman-connect-button-foreground: #fafafa;
    }

    @font-face {
      font-family: 'Surt';
      font-style: normal;
      font-weight: 400;
      font-display: auto;
      src: url(${SurtRegular}) format('woff2');
    }

    @font-face {
      font-family: 'Surt';
      font-style: normal;
      font-weight: 600;
      font-display: auto;
      src: url(${SurtSemiBold}) format('woff2');
    }

    @font-face {
      font-family: 'SurtExt';
      font-style: normal;
      font-weight: 600;
      font-display: auto;
      src: url(${SurtExtendedSemiBold}) format('woff2');
    }

    @font-face {
      font-family: 'Standard';
      font-style: normal;
      font-weight: 400;
      font-display: auto;
      src: url(${StandardBook}) format('woff2');
    }

    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      color: inherit;
    }

    #root {
      height: 100%;
    }

    body,
    html {
      font-family: 'Surt', sans-serif;
      padding: 0;
      margin: 0;
      scroll-behavior: smooth;
      font-size: 10px;
      min-height: 100%;
      height: 100vh;
      font-weight: var(--font-weight-regular);
    }

    body {
      background: rgb(${theme?.background});
      color: rgb(${theme?.foreground});
      font-size: var(--font-size-normal);
    }

    h1,
    h2,
    h3,
    p {
      line-height: 1.2em;
      margin: 0;
      font-weight: var(--font-weight-regular);

      &.-muted {
        opacity: 0.7;
      }
    }

    h1 {
      font-family: 'Surt', sans-serif;
      font-weight: var(--font-weight-regular);
      font-size: 32px;
      line-height: 120%;
      color: var(--color-offWhite);
    }

    h2 {
      font-family: 'Surt', sans-serif;
      font-weight: var(--font-weight-regular);
      font-size: 24px;
      line-height: 120%;
    }

    h3 {
      font-family: 'Surt', sans-serif;
      font-weight: var(--font-weight-regular);
      font-size: 18px;
      line-height: 120%;
    }

    p {
      font-family: 'Surt', sans-serif;
      font-weight: var(--font-weight-regular);
      font-size: 16px;
      line-height: 140%;
    }

    a {
      text-decoration: none;
      transition: all 0.15s;
    }

    hr {
      opacity: 0.15;
      height: 0;
      border: none;
      border-bottom: 1px solid currentColor;
    }

    button,
    input {
      font: inherit;
    }

    strong {
      font-weight: var(--font-weight-bold);
    }

    @keyframes spin {
      0% {
        transform: rotateZ(0deg);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }

    svg.feather-loader {
      opacity: 0.4;
      animation: spin linear 3s infinite;
    }

    *:focus {
      outline: none;
    }

    ::placeholder {
      color: rgba(${theme?.foreground}, 0.2);
    }

    input,
    select {
      font-size: var(--font-size-normal);
    }

    .muted {
      font-size: 0.8em;
      opacity: 0.4;
    }

    /* width */
    ::-webkit-scrollbar {
      width: 6px;
      padding: 2px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgba(${theme?.foreground}, 0.2);
      border-radius: 4px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(${theme?.foreground}, 0.4);
    }
  `
}

const appTheme = {
  ...theme.greenDark,
  primary: '213,255,92', // #d5ff5c
  secondary: '0,0,255',
  background: '18,18,18',
  backgroundSecondary: '27,27,27', // #1b1b1b
  backgroundLight: '47,47,47', // #2f2f2f
  backgroundLighter: '63,63,63', // #3f3f3f
  foreground: '165,165,165', // #a5a5a5
  mid: '150,150,150',
  dim: '90,90,90', // #5a5a5a
  light: '250,250,250', // #fafafa
  dark: '0,0,0',
  text: '250,250,250', // #fafafa
  activeBackground: '56,56,56', // #383838
  controlBackground: '38,38,38',
  offWhite: '242,242,242', // #f2f2f2
  grey800: '38,38,38', // #262626
}

const Provider = ({ children }: PropsWithChildren<{}>) => (
  <ThemeProvider theme={appTheme}>
    <Global styles={globalStyle} />
    {children}
  </ThemeProvider>
)

export default Provider
