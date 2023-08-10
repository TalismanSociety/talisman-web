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
    border: string
    error: string
    onError: string
    errorContainer: string
    onErrorContainer: string
    /**
     * @deprecated use surface & surface tint (via Surface component)
     */
    foreground: string
    /**
     * @deprecated use surface & surface tint (via Surface component)
     */
    onForeground: string
    /**
     * @deprecated use surface & surface tint (via Surface component)
     */
    foregroundVariant: string
    /**
     * @deprecated use surface & surface tint (via Surface component)
     */
    onForegroundVariant: string
  }
  contentAlpha: {
    disabled: number
    medium: number
    high: number
  }
}

const greenDark: TalismanTheme = {
  typography: {
    h1: { fontFamily: 'SurtExpanded', fontSize: 56 },
    h2: { fontFamily: 'SurtExpanded', fontSize: 32 },
    h3: { fontFamily: 'SurtExpanded', fontSize: 24 },
    h4: { fontFamily: 'SurtExpanded', fontSize: 18 },
    bodyLarge: { fontFamily: 'Surt', fontSize: 16, fontWeight: 'normal', margin: 0 },
    body: { fontFamily: 'Surt', fontSize: 14, fontWeight: 'normal', margin: 0 },
    bodySmall: { fontFamily: 'Surt', fontSize: 12, fontWeight: 'normal', margin: 0 },
  },
  color: {
    primary: '#d5ff5c',
    onPrimary: '#121212',
    primaryContainer: `color-mix(in srgb, #d5ff5c, transparent 88%)`,
    onPrimaryContainer: '#d5ff5c',
    background: '#121212',
    onBackground: '#fafafa',
    surface: '#1B1B1B',
    onSurface: '#fafafa',
    surfaceTint: '#fafafa',
    error: '#d22424',
    onError: '#fafafa',
    errorContainer: '#fd48483e',
    onErrorContainer: '#d22424',
    foreground: '#262626',
    onForeground: '#fafafa',
    foregroundVariant: '#3f3f3f',
    onForegroundVariant: '#fafafa',
    border: '#2F2F2F',
  },
  contentAlpha: {
    disabled: 0.5,
    medium: 0.7,
    high: 1,
  },
}

export const theme = { greenDark }
