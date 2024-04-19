import type { Preview } from '@storybook/react'
import { theme as storybookTheme } from '@talismn/development/storybook'
import { ThemeProvider, theme } from '@talismn/ui'
import '@talismn/ui/assets/css/talismn.css'
import React from 'react'

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
    <ThemeProvider theme={theme.greenDark}>
      <Story />
    </ThemeProvider>
  ),
]

export default preview
