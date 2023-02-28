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
    primary: 'rgb(213,255,92)',
    onPrimary: 'rgb(18,18,18)',
    background: 'rgb(18,18,18)',
    onBackground: 'rgb(250,250,250)',
    surface: '#1B1B1B',
    onSurface: 'rgb(250,250,250)',
    foreground: '#262626',
    onForeground: 'rgb(250,250,250)',
    foregroundVariant: '#3F3F3F',
    onForegroundVariant: 'rgb(250,250,250)',
    border: '#262626',
    error: 'rgba(253, 72, 72, 0.25)',
    onError: '#D22424',
  },
  contentAlpha: {
    disabled: 0.5,
    medium: 0.7,
    high: 1,
  },
}

export const theme = { greenDark }
