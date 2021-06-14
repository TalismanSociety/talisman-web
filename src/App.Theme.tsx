import { 
  createContext, 
  useContext,
  useState,
} from 'react'
import { 
  DefaultTheme, 
  ThemeProvider,
  createGlobalStyle
} from "styled-components"




/* 
  base style definitions
  allow component styling using css variables, defined below
  usage: background: var(--color-primary) or font-size: var(--font-size-large)
*/

// color defs
const colors = {
  'FF8A74': ['primary'],
  'E1FFED': ['secondary'],
  'FFFFFF': ['light'],
  'E5E5E5': ['light-grey'],
  '999999': ['grey'],
  '737373': ['dark-grey'],
  '000000': ['dark'],
  'ead017': ['gold'],
  '21C91D': ['status-ok', 'status-success', 'status-online', 'green', 'positive', 'success'],
  'FFCF96': ['status-concern', 'status-warning', 'orange', 'warning'],
  'D44B23': ['status-failure', 'status-error', 'red', 'negative', 'error'],
  'B9D9FF': ['status-neutral', 'status-default', 'blue'],
}

// font size defs
const fontSizes = {
  xxlarge: 3.2,
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




// global styling

// vars
const Vars = createGlobalStyle`  
  :root {
    // colors mappings
    ${Object.keys(colors).map(hex => colors[hex].map(status => `--color-${status}: #${hex};`))}

    // fonts size mappings
    ${Object.keys(fontSizes).map(name => `--font-size-${name}: ${fontSizes[name]}rem;`)}

    // font weights
    ${Object.keys(fontWeights).map(name => `--font-weight-${name}: ${fontWeights[name]};`)}

    // misc
    --border: 0.2rem solid var(--color-dark);
    --border-dashed: 0.2rem dashed var(--color-dark);
    --padding: 2.2rem 3rem;
    --padding-large: 4.2rem 4rem;
    --padding-small: 1.1rem 1.5rem;

  }
`

// base/reset 
const Reset = createGlobalStyle`  
    *{
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        color: inherit;
        font-weight: 400;
        line-height: 1.6em;
    }

    html,body {
        padding: 0;
        margin: 0;
        scroll-behavior: smooth;
        font-size: 10px;
        min-height: 100%;
    }

    body{
        color: var(--color-dark);
        background: var(--color-light);
        font-size: var(--font-size-normal);

        @media (max-width: 560px) { 
            font-size: var(--font-size-small);
        }
    }

    main{
        //height: 100%;
        //max-height: 100vh;
        //display: initial;
        //overflow-y: scroll;
        //min-width: 480px;
    }

    strong{
        font-weight: 600
    }

    a{
        text-decoration: none;
        transition: all 0.15s;
    }
    
    hr{
        opacity: 0.15;
        height: 0;
        border: none;
        border-bottom: 1px solid currentColor;
    }

    *:focus{
        outline: none;
    }

    @keyframes spin {
        0% { transform: rotateZ(0deg) } 
        100% { transform: rotateZ(360deg) } 
    }

    svg{
        width: 1em;
        height: 1em;

        &[data-spin]{
            animation: spin linear 2s infinite;
        }
    }
`

// theme
const Theme = createGlobalStyle`  
    :root{}

    body,html{
        font-family: 'Space Mono', sans-serif;
    }

    h1,h2,h3,h4,h5,p{
        line-height: 1.2em;
        margin: 0 0 0.75em;
        font-weight: var(--font-weight-regular);

        &.-muted{
            opacity: 0.7
        }

        a{
            line-height: inherit;
            opacity: 0.6;
            color: ${({ theme }) => theme?.link};
        }
    }

    h1{
        font-size: var(--font-size-xxlarge);
        font-weight: var(--font-weight-bold);
    }

    h2{
        font-size: var(--font-size-xlarge);
    }

    h3,
    h4,
    h5,{
        font-size: var(--font-size-large);
    }

    p{
        font-size: var(--font-size-normal);
    }

    .field{
        font: inherit
    }

    button{
        font: inherit
    }
`




/* theming options */

declare module "styled-components" {
  export interface DefaultTheme {
    primary: string
    secondary: string
    invert: string 
  }
}

const light: DefaultTheme = {
  primary: '#000',
  secondary: 'blue',
  invert: '#fff',
  link: 'blue'
}

const dark: DefaultTheme = {
  primary: '#fff',
  secondary: 'red',
  invert: '#000',
  link: 'blue'
}

const themes = {
  light,
  dark
}



/* style context */

const Context = createContext({});

export const useTheme = () => useContext(Context)

const Provider = ({children}) => {
  const [theme, setTheme] = useState('light')
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  return <Context.Provider 
    value={{
      theme,
      toggle
    }}
    >
    <Vars/>
    <Reset/>
    <Theme/>
    <ThemeProvider theme={themes[theme]}>
      {children}
    </ThemeProvider>
  </Context.Provider>
}

export default Provider