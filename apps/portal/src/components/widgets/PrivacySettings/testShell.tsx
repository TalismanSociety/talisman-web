import { Subscribe } from "@react-rxjs/core"
import { act, fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { ThemeProvider, theme } from "@/ui/theme"

export const STORAGE_KEY = "analytics-consent"

export const storedConsent = () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null")

export const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 50)))

export const click = async (name: string) => {
	fireEvent.click(screen.getByRole("button", { name }))
	await settle()
}

export const stubModalDialogs = () => {
	HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
		this.setAttribute("open", "")
	}
	HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
		this.removeAttribute("open")
	}
}

export const renderInPortal = (children: ReactNode) =>
	render(
		<ThemeProvider theme={theme.greenDark}>
			<Subscribe>{children}</Subscribe>
		</ThemeProvider>
	)
