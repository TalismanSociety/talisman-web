import { ThemeProvider as EmotionThemeProvider, Global, css, useTheme as useEmotionTheme } from '@emotion/react'
import { createContext, useContext, type PropsWithChildren } from 'react'

type Typography = {
  fontFamily: string
  fontSize: number
  fontWeight?: string
  margin?: string | number
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface Theme {
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
  shape: {
    none: number | string
    extraSmall: number | string
    small: number | string
    medium: number | string
    large: number | string
    extraLarge: number | string
    full: number | string
  }
}

type TalismanTheme = Theme

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme extends TalismanTheme {}
}

const greenDark: Theme = {
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
  shape: {
    none: 0,
    extraSmall: '0.4rem',
    small: '0.8rem',
    medium: '1.2rem',
    large: '1.6rem',
    extraLarge: '2.8rem',
    full: '100dvw',
  },
}

export type ContentAlpha = keyof Theme['contentAlpha']

export const theme = { greenDark }

export const useTheme = useEmotionTheme

export type ThemeProviderProps = PropsWithChildren<
  | {
      merge: true
      theme?: {
        typography?: Partial<Theme['typography']>
        color?: Partial<Theme['color']>
        contentAlpha?: Partial<Theme['contentAlpha']>
        shape?: Partial<Theme['shape']>
      }
    }
  | { merge?: false | undefined; theme: Theme }
>

const ThemeHasRootContext = createContext(false)

export const ThemeProvider = ({ theme: propsTheme = greenDark, merge = false, children }: ThemeProviderProps) => {
  const hasRoot = useContext(ThemeHasRootContext)
  const parentTheme = useEmotionTheme()

  const theme: Theme = !merge
    ? (propsTheme as Theme)
    : {
        typography: { ...parentTheme.typography, ...propsTheme.typography },
        color: { ...parentTheme.color, ...propsTheme.color },
        contentAlpha: { ...parentTheme.contentAlpha, ...propsTheme.contentAlpha },
        shape: { ...parentTheme.shape, ...propsTheme.shape },
      }

  return (
    <>
      {!hasRoot && theme.color !== undefined && theme.typography !== undefined && (
        <Global
          styles={css`
            :root {
              color: ${theme.color.onBackground};
              font-family: ${theme.typography.body.fontFamily};
              font-size: 10px;
              font-weight: ${theme.typography.body.fontWeight ?? 'revert'};
              background-color: ${theme.color.background};
            }

            body {
              font-size: ${theme.typography.body.fontSize}px;
            }
          `}
        />
      )}
      {hasRoot ? (
        <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
      ) : (
        <ThemeHasRootContext.Provider value={true}>
          <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
        </ThemeHasRootContext.Provider>
      )}
    </>
  )
}
