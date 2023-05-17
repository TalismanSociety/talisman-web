import { ThemeProvider, type Theme } from '@emotion/react'
import { Preview } from '@storybook/react'
import { theme as storybookTheme } from '@talismn/development/storybook'
import React from 'react'
import '../assets/css/talismn.css'
import { theme } from '../src/theme'

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
