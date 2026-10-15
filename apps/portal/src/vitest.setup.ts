import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

afterEach(() => {
	cleanup()
	if (typeof window !== "undefined") window.localStorage.clear()
})
