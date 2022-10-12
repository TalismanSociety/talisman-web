import { Global, ThemeProvider } from '@emotion/react'

import { globalStyle, greenDark, greenLight } from '../src/App.Theme'

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
      <Global styles={globalStyle} />
      <Story />
    </ThemeProvider>
  ),
]
