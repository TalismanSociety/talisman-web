import type { Preview } from '@storybook/react'
import { Global } from '@emotion/react'
import { theme as storybookTheme } from '@talismn/development/storybook'
import { ThemeProvider } from '@talismn/ui/theme'
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
      <ThemeProvider>
        <Global styles={globalStyle} />
        <Story />
      </ThemeProvider>
    </MemoryRouter>
  ),
]

export default preview
