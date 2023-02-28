import '../assets/css/talismn.css'

import { Global, ThemeProvider, css } from '@emotion/react'

import { greenDark } from '../src/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  Story => (
    <ThemeProvider theme={greenDark}>
      <Global
        styles={css`
          html,
          body {
            font-size: 10px;
          }
        `}
      />
      <Story />
    </ThemeProvider>
  ),
]
