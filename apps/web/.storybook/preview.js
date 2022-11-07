import { Global, ThemeProvider } from '@emotion/react'
import { MemoryRouter } from 'react-router-dom'

import { globalStyle, greenDark } from '../src/App.Theme'
import theme from './talismanTheme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme,
  },
}

export const decorators = [
  Story => (
    <MemoryRouter>
      <ThemeProvider theme={greenDark}>
        <Global styles={globalStyle} />
        <Story />
      </ThemeProvider>
    </MemoryRouter>
  ),
]
