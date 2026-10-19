import { act, render } from "@testing-library/react"
import { AnimatePresence } from "motion/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it } from "vitest"
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
})
