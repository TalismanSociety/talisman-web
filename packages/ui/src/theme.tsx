export type TalismanTheme = {
  color: {
    primary: string
    onPrimary: string
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
  color: {
    primary: '#d5ff5c',
    onPrimary: '#121212',
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
