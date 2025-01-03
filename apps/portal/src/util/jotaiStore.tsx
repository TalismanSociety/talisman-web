import { createStore, Provider } from 'jotai'
import { ReactNode } from 'react'

/**
 * Use this for access to the jotai store from outside of the react component lifecycle.
 *
 * For more information, see https://jotai.org/docs/guides/using-store-outside-react.
 */
export const jotaiStore = createStore()

export const JotaiProvider = ({ children }: { children?: ReactNode }) => (
  <Provider store={jotaiStore}>{children}</Provider>
)
