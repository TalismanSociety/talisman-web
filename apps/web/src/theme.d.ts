import '@talismn/ui'

declare module '@talismn/ui' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface Theme {
    // Deprecated styling
    primary: string
    secondary: string
    background: string
    foreground: string
    mid: string
    dim: string
    light: string
    dark: string
    text: string
    activeBackground: string
    controlBackground: string
  }
}
