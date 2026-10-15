import { createStore, Provider } from "jotai"
import type { ReactNode } from "react"

const jotaiStore = createStore()

export const JotaiProvider = ({ children }: { children?: ReactNode }) => (
	<Provider store={jotaiStore}>{children}</Provider>
)
