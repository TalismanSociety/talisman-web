type Typography = {
  fontFamily: string
  fontSize: number
  fontWeight?: string
  margin?: string | number
}

export type TalismanTheme = {
  typography: {
    h1: Typography
    h2: Typography
    h3: Typography
    h4: Typography
    bodyLarge: Typography
    body: Typography
    bodySmall: Typography
  }
  color: {
    primary: string
    onPrimary: string
    primaryContainer: string
    onPrimaryContainer: string
    background: string
    onBackground: string
    surface: string
    onSurface: string
    surfaceTint: string
    outline: string
    outlineVariant: string
    error: string
    onError: string
    errorContainer: string
    onErrorContainer: string
  }
  contentAlpha: {
    disabled: number
    medium: number
    high: number
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends TalismanTheme {}
}

const greenDark: TalismanTheme = {
  typography: {
    h1: { fontFamily: 'SurtExpanded', fontSize: 56, margin: 0 },
    h2: { fontFamily: 'SurtExpanded', fontSize: 32, margin: 0 },
    h3: { fontFamily: 'SurtExpanded', fontSize: 24, margin: 0 },
    h4: { fontFamily: 'SurtExpanded', fontSize: 18, margin: 0 },
    bodyLarge: { fontFamily: 'Surt', fontSize: 16, fontWeight: 'normal', margin: 0 },
    body: { fontFamily: 'Surt', fontSize: 14, fontWeight: 'normal', margin: 0 },
    bodySmall: { fontFamily: 'Surt', fontSize: 12, fontWeight: 'normal', margin: 0 },
  },
  color: {
    primary: '#d5ff5c',
    onPrimary: '#121212',
    primaryContainer: '#d5ff5c',
    onPrimaryContainer: '#121212',
    background: '#121212',
    onBackground: '#fafafa',
    surface: '#1b1b1b',
    onSurface: '#fafafa',
    surfaceTint: '#fafafa',
    error: '#d22424',
    onError: '#fafafa',
    errorContainer: '#fd48483e',
    onErrorContainer: '#d22424',
    outline: '#fafafa',
    outlineVariant: '#2f2f2f',
  },
  contentAlpha: {
    disabled: 0.5,
    medium: 0.7,
    high: 1,
  },
}

export type ContentAlpha = keyof TalismanTheme['contentAlpha']

export const theme = { greenDark }
