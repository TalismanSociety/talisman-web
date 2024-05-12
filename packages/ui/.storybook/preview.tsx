import '../assets/css/talismn.css'
import { ThemeProvider, type Theme } from '../src/theme'
import { theme } from '../src/theme'
import type { Preview } from '@storybook/react'
import { theme as storybookTheme } from '@talismn/development/storybook'
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
    <ThemeProvider theme={theme.greenDark as any as Theme}>
      <Story />
    </ThemeProvider>
  ),
]

export default preview
