import '@talismn/ui/assets/css/talismn.css'

import ATApocRevelations from '@assets/fonts/AT-Apoc-Revelations.woff'
import SurtRegular from '@assets/fonts/Surt-Regular.woff'
import SurtSemiBold from '@assets/fonts/Surt-SemiBold.woff2'
import SurtSemiBoldExpanded from '@assets/fonts/Surt-SemiBoldExp.woff2'
import SurtSemiBoldExtended from '@assets/fonts/Surt-SemiBoldExtended.woff2'
import { Global, type Theme, ThemeProvider, css } from '@emotion/react'
import { type TalismanTheme, theme } from '@talismn/ui'
import { type PropsWithChildren } from 'react'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends TalismanTheme {
    // Deprecated styling
    primary: string
    secondary: string
    background: string
    foreground: string
    mid: string
    dim: string
    light: string
    dark: string
    text: string
    activeBackground: string
    controlBackground: string
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
  regular: 400,
  bold: 700,
}

// base style
export const globalStyle = (theme: Theme) => css`
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
    font-style: light;
    font-weight: 300;
    font-display: auto;
    src: url(${SurtRegular}) format('woff');
  }

  @font-face {
    font-family: 'Surt';
    font-style: bold;
    font-weight: 800;
    font-display: auto;
    src: url(${SurtSemiBold}) format('woff2');
  }

  @font-face {
    font-family: 'SurtExpanded';
    font-style: bold;
    font-weight: 800;
    font-display: auto;
    src: url(${SurtSemiBoldExpanded}) format('woff2');
  }

  @font-face {
    font-family: 'SurtExtended';
    font-style: bold;
    font-weight: 800;
    font-display: auto;
    src: url(${SurtSemiBoldExtended}) format('woff2');
  }

  @font-face {
    font-family: 'ATApocRevelations';
    font-style: normal;
    font-weight: 400;
    font-display: auto;
    src: url(${ATApocRevelations}) format('woff');
  }

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    color: inherit;
  }

  body,
  html {
    font-family: 'Surt', sans-serif;
    padding: 0;
    margin: 0;
    scroll-behavior: smooth;
    font-size: 10px;
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
  h4,
  h5,
  p {
    line-height: 1.2em;
    margin: 0 0 0.75em;
    font-weight: var(--font-weight-regular);

    &.-muted {
      opacity: 0.7;
    }
  }

  h1 {
    font-size: var(--font-size-xxlarge);
    font-weight: var(--font-weight-bold);
    font-family: 'SurtExpanded', sans-serif;
  }

  h2 {
    font-size: var(--font-size-xlarge);
  }

  h3,
  h4,
  h5 {
    font-size: var(--font-size-large);
  }

  p {
    font-size: var(--font-size-normal);
    line-height: 1.6em;
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

  button {
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
`

const appTheme = {
  ...theme.greenDark,
  primary: '213,255,92',
  secondary: '0,0,255',
  background: '18,18,18',
  foreground: '165,165,165', // #a5a5a5
  mid: '150,150,150',
  dim: '90,90,90', // #5a5a5a
  light: '250,250,250', // #fafafa
  dark: '0,0,0',
  text: '250,250,250', // #fafafa
  activeBackground: '56,56,56', // #383838
  controlBackground: '38,38,38',
}

const Provider = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={appTheme}>
    <Global styles={globalStyle} />
    {children}
  </ThemeProvider>
)

export default Provider
