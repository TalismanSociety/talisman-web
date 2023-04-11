# @talismn/ui

## Installation

```sh
yarn add @talismn/ui
```

`@talismn/ui` has a number of required peer dependencies. If your project doesn't have them already, you can install them by running:

```sh
yarn add @emotion/react @talismn/icons framer-motion react-hot-toast
```

## Configuring the theme

```tsx
import '@talismn/ui/assets/css/talismn.css'

import { ThemeProvider } from '@emotion/react'
import { theme } from '@talismn/ui'

export const App = () => {
  return <ThemeProvider theme={theme.greenDark}>{/* Your app */}</ThemeProvider>
}
```

## Typing the theme

```ts
import { TalismanTheme } from '@talismn/ui'

declare module '@emotion/react' {
  export interface Theme extends TalismanTheme {}
}
```

For more information, refer to [Emotion's TypeScript documentation](https://emotion.sh/docs/typescript).
