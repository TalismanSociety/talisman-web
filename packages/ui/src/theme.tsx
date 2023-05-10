export type TalismanTheme = {
  color: {
    primary: string
    onPrimary: string
    background: string
    onBackground: string
    surface: string
    onSurface: string
    foreground: string
    onForeground: string
    foregroundVariant: string
    onForegroundVariant: string
    border: string
    error: string
    onError: string
  }
  contentAlpha: {
    disabled: number
    medium: number
    high: number
  }
}

const greenDark: TalismanTheme = {
  color: {
    primary: '#d5ff5c',
    onPrimary: '#121212',
    background: '#121212',
    onBackground: '#fafafa',
    surface: '#1B1B1B',
    onSurface: '#fafafa',
    foreground: '#262626',
    onForeground: '#fafafa',
    foregroundVariant: '#3f3f3f',
    onForegroundVariant: '#fafafa',
    border: '#2F2F2F',
    error: '#fd48483e',
    onError: '#d22424',
  },
  contentAlpha: {
    disabled: 0.5,
    medium: 0.7,
    high: 1,
  },
}

export const theme = { greenDark }
