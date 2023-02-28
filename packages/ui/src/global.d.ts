import { TalismanTheme } from './theme'

declare module '@emotion/react' {
  export interface Theme extends TalismanTheme {}
}
