import '../assets/css/talismn.css'

import { ThemeProvider } from '@emotion/react'
import { theme as storybookTheme } from '@talismn/development/storybook'

import { theme } from '../src/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: storybookTheme,
  },
}

export const decorators = [
  Story => (
    <ThemeProvider theme={theme.greenDark}>
      <Story />
    </ThemeProvider>
  ),
]
