import { Global, ThemeProvider } from '@emotion/react'
import type { Preview } from '@storybook/react'
import { theme as storybookTheme } from '@talismn/development/storybook'
import { theme } from '@talismn/ui'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { globalStyle } from '../src/App.Theme'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
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
  },
}

export const decorators = [
  Story => (
    <MemoryRouter>
      <ThemeProvider theme={theme.greenDark}>
        <Global styles={globalStyle} />
        <Story />
      </ThemeProvider>
    </MemoryRouter>
  ),
]

export default preview
