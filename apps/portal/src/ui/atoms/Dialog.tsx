import { usePresence } from "motion/react"
import React, { useEffect, useState } from "react"

export type DialogProps = Omit<
	React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>,
	"ref"
> & {
	isModal?: boolean
	/**
	 * The content of dialog is unmounted when closed.
	 * If you need to make the content available to search engines
	 * or render expensive component trees inside your dialog
	 * while optimizing for interaction responsiveness
	 * it might be a good idea to change this default behavior
	 * by enabling the `keepMounted` prop
	 */
	keepMounted?: boolean
	onRequestDismiss?: () => unknown
}

type Phase = "open" | "closing" | "closed"

const ownAnimations = (element: HTMLDialogElement) =>
	element
		.getAnimations({ subtree: true })
		.filter((animation) => (animation.effect as KeyframeEffect | null)?.target === element)

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
	{ open = true, isModal = true, keepMounted = false, onRequestDismiss, ...props },
	ref
) {
	const [isPresent, safeToRemove] = usePresence()
	const shown = open && isPresent
	const [phase, setPhase] = useState<Phase>(shown ? "open" : "closed")
	const [element, setElement] = useState<HTMLDialogElement | null>(null)

	if (shown && phase !== "open") setPhase("open")
	if (!shown && phase === "open") setPhase("closing")

	useEffect(() => {
		if (element === null || phase !== "open" || element.open) return

		if (isModal) {
			element.showModal()
		} else {
			element.show()
		}
	}, [element, isModal, phase])

	useEffect(() => {
		if (element === null || phase !== "closing") return

		let interrupted = false
		Promise.allSettled(ownAnimations(element).map((animation) => animation.finished)).then(() => {
			if (interrupted) return
			element.close()
			setPhase("closed")
			safeToRemove?.()
		})
		return () => {
			interrupted = true
		}
	}, [element, phase, safeToRemove])

	useEffect(() => {
		const listener = function (this: HTMLDialogElement, event: MouseEvent) {
			if (event.target !== element) {
				return
			}

			const rect = this.getBoundingClientRect()
			if (
				event.clientY < rect.top ||
				event.clientY > rect.bottom ||
				event.clientX < rect.left ||
				event.clientX > rect.right
			) {
				onRequestDismiss?.()
			}
		}

		element?.addEventListener("click", listener)

		return () => element?.removeEventListener("click", listener)
	}, [element, onRequestDismiss])

	if (phase === "closed" && !keepMounted) {
		return null
	}

	return (
		// NOTE: can't do the following because of this issue https://github.com/emotion-js/emotion/issues/3038
		// {open && <Global styles={{ body: { overflow: 'hidden' } }} />}
		<dialog
			ref={(element) => {
				if (typeof ref === "function") {
					ref(element)
				} else if (ref !== null) {
					ref.current = element
				}

				setElement(element)
			}}
			// https://github.com/whatwg/html/issues/7732
			css={{
				overscrollBehavior: "contain",
				"::backdrop": {
					overscrollBehavior: "contain",
				},
			}}
			data-closing={phase === "closing" || undefined}
			{...props}
			onCancel={(event) => {
				props.onCancel?.(event)
				if (onRequestDismiss === undefined) return
				event.preventDefault()
				onRequestDismiss()
			}}
		/>
	)
})
