# @talismn/ui

## Installation

```sh
yarn add @talismn/ui
```

`@talismn/ui` has a number of required peer dependencies. If your project doesn't have them already, you can install them by running:

```sh
yarn add @emotion/react @talismn/web-icons framer-motion
```

## Configuring the theme

```tsx
import { theme, ThemeProvider } from '@talismn/ui/theme'

import '@talismn/ui/assets/css/talismn.css'

export const App = () => {
  return <ThemeProvider theme={theme.greenDark}>{/* Your app */}</ThemeProvider>
}
```

For more information, refer to [Emotion's TypeScript documentation](https://emotion.sh/docs/typescript).
