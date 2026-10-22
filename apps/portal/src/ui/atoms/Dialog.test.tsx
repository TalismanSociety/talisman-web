import { act, createEvent, fireEvent, render } from "@testing-library/react"
import { AnimatePresence } from "motion/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Dialog } from "./Dialog"

let finishExit: () => void

beforeEach(() => {
	HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
		this.setAttribute("open", "")
	}
	HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
		this.removeAttribute("open")
	}
	HTMLDialogElement.prototype.getAnimations = function (this: HTMLDialogElement) {
		if (!this.hasAttribute("data-closing")) return []
		const finished = new Promise<void>((resolve) => {
			finishExit = resolve
		})
		return [{ effect: { target: this }, finished } as unknown as Animation]
	}
})

const dialog = () => document.querySelector("dialog")

const expectExitToPlayBeforeUnmount = async () => {
	expect(dialog()?.open).toBe(true)
	expect(dialog()?.hasAttribute("data-closing")).toBe(true)

	await act(async () => finishExit())

	expect(dialog()).toBeNull()
}

describe("Dialog", () => {
	it("plays its exit animation before unmounting when closed", async () => {
		const view = (open: boolean) => <Dialog open={open}>Content</Dialog>
		const { rerender } = render(view(true))

		rerender(view(false))

		await expectExitToPlayBeforeUnmount()
	})

	it("plays its exit animation before unmounting when its parent removes it", async () => {
		const view = (children: ReactNode) => <AnimatePresence>{children}</AnimatePresence>
		const { rerender } = render(view(<Dialog key="dialog">Content</Dialog>))

		rerender(view(null))

		await expectExitToPlayBeforeUnmount()
	})

	it("requests dismissal on Escape instead of letting the browser close it at once", () => {
		const onRequestDismiss = vi.fn()
		render(<Dialog onRequestDismiss={onRequestDismiss}>Content</Dialog>)

		const escape = createEvent.keyDown(dialog() as HTMLDialogElement, { key: "Escape" })
		fireEvent(dialog() as HTMLDialogElement, escape)

		expect(onRequestDismiss).toHaveBeenCalledOnce()
		expect(escape.defaultPrevented).toBe(true)
	})

	describe("backdrop", () => {
		const inside = { clientX: 700, clientY: 300 }
		const outside = { clientX: 100, clientY: 300 }

		const renderSheet = () => {
			const onRequestDismiss = vi.fn()
			render(
				<Dialog onRequestDismiss={onRequestDismiss}>
					<input defaultValue="Content" />
				</Dialog>
			)
			const element = dialog() as HTMLDialogElement
			element.getBoundingClientRect = () => new DOMRect(500, 0, 500, 800)
			return {
				element,
				content: element.querySelector("input") as HTMLInputElement,
				onRequestDismiss,
			}
		}

		it("requests dismissal when pressed and released on the backdrop", () => {
			const { element, onRequestDismiss } = renderSheet()

			fireEvent.pointerDown(element, outside)
			fireEvent.click(element, outside)

			expect(onRequestDismiss).toHaveBeenCalledOnce()
		})

		it.each([
			["its content", (view: ReturnType<typeof renderSheet>) => view.content],
			["its padding", (view: ReturnType<typeof renderSheet>) => view.element],
		])("stays open when pressed on %s and released on the backdrop", (_, pressTarget) => {
			const view = renderSheet()

			fireEvent.pointerDown(pressTarget(view), inside)
			fireEvent.click(view.element, outside)

			expect(view.onRequestDismiss).not.toHaveBeenCalled()
		})
	})
})
