import ATApocRevelations from '@assets/fonts/AT-Apoc-Revelations.woff'
import SurtRegular from '@assets/fonts/Surt-Regular.woff'
import SurtSemiBold from '@assets/fonts/Surt-SemiBold.woff2'
import SurtSemiBoldExpanded from '@assets/fonts/Surt-SemiBoldExp.woff2'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DefaultTheme, ThemeProvider, createGlobalStyle, css } from 'styled-components'

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
const Style = createGlobalStyle`
  /*
      define all options as css variables
  */
  :root {
    /* theme colors as css variables */
    ${({ theme }) => !!theme && Object.keys(theme).map(name => css`--color-${name}: rgb(${theme[name]});`)}

    /* status color mappings */
    ${Object.keys(statusColors).map(hex => statusColors[hex].map(status => css`--color-status-${status}: #${hex};`))}

    /* fonts size mappings */
    ${Object.keys(fontSizes).map(name => css`--font-size-${name}: ${fontSizes[name]}rem;`)}

    /* font weights */
    ${Object.keys(fontWeights).map(name => css`--font-weight-${name}: ${fontWeights[name]};`)}

    /* misc */
    --border: 0.2rem solid var(--color-dark);
    --border-radius: 1.5rem;
    --border-dashed: 0.2rem dashed var(--color-dark);
    --padding: 2.2rem 3rem;
    --padding-large: 4.2rem 4rem;
    --padding-small: 1.1rem 1.5rem;
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
    line-height: 1.6em;
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
    background: rgb(${({ theme }) => theme?.background});
    color: rgb(${({ theme }) => theme?.foreground});
    font-size: var(--font-size-normal);
  }

  #root {
    height: 100%;
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

    a {
      line-height: inherit;
      opacity: 0.6;
      color: rgb(${({ theme }) => theme?.primary});
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

  svg {
    width: 1em;
    height: 1em;
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
    color: rgba(${({ theme }) => theme?.foreground}, 0.2);
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

/* theming options */
// declare all theme based colors in rgb
// when using in component, need to wrap in rgb(...) declaration
// can also use rgba to define opacity

declare module 'styled-components' {
  export interface DefaultTheme {
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

const orangeLight: DefaultTheme = {
  primary: '244,101,69',
  secondary: '0,0,255',
  background: '250,250,250',
  foreground: '0,0,0',
  mid: '150,150,150',
  dim: '245,245,245',
  light: '250,250,250',
  dark: '0,0,0',
  text: '0,0,0',
  activeBackground: '56,56,56',
  controlBackground: '38,38,38',
}

const orangeDark: DefaultTheme = {
  primary: '244,101,69',
  secondary: '0,0,255',
  background: '0,0,0',
  foreground: '255,255,255',
  mid: '150,150,150',
  dim: '245,245,245',
  light: '255,255,255',
  dark: '0,0,0',
  text: '255,255,255',
  activeBackground: '56,56,56',
  controlBackground: '38,38,38',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const orangeTheme = {
  light: orangeLight,
  dark: orangeDark,
}

const greenLight: DefaultTheme = {
  primary: '213, 255, 92',
  secondary: '0,0,255',
  background: '250,250,250',
  foreground: '0,0,0',
  mid: '150,150,150',
  dim: '245,245,245',
  light: '250,250,250',
  dark: '0,0,0',
  text: '0,0,0',
  activeBackground: '56,56,56',
  controlBackground: '38,38,38',
}

const greenDark: DefaultTheme = {
  primary: '213,255,92',
  secondary: '0,0,255',
  background: '27,27,27',
  foreground: '165,165,165',
  mid: '150,150,150',
  dim: '90,90,90', // #5a5a5a
  light: '250,250,250', // #fafafa
  dark: '0,0,0',
  text: '250,250,250', // #fafafa
  activeBackground: '56,56,56', // #383838
  controlBackground: '38,38,38',
}

const greenTheme = {
  light: greenLight,
  dark: greenDark,
}

const themes = {
  ...greenTheme,
}

/* style context */

const Context = createContext({})

export const useTheme = () => useContext(Context)

const Provider = ({ children }: PropsWithChildren<{}>) => {
  // theme stuff
  const [theme, setTheme] = useState('dark')
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const set = (mode: string) => setTheme(mode === 'dark' ? 'dark' : 'light')

  // scroll to top on location change
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <Context.Provider
      value={{
        theme,
        toggle,
        set,
      }}
    >
      <ThemeProvider theme={themes[theme]}>
        <Style />
        {children}
      </ThemeProvider>
    </Context.Provider>
  )
}

export default Provider
