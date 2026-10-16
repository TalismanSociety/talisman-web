import type { ErrorInfo, PropsWithChildren, ReactElement, ReactNode } from "react"
import { Component, createContext, useContext, useState } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"
import type { ErrorMessageProps } from "@/components/recipes/ErrorMessage"
import { ErrorMessage } from "@/components/recipes/ErrorMessage"
import { captureError } from "@/domains/analytics/client"
import { Button, SurfaceButton } from "@/ui/atoms/Button"

const OrientationContext = createContext<ErrorMessageProps["orientation"]>(undefined)

type ErrorElementProps = {
	error: Error
	componentStack: string | null
	resetError: () => void
}

const ErrorElement = (props: ErrorElementProps) => {
	const message =
		`${props.error.name}\n\n${props.error.message}` +
		(props.error.cause ? `\n\n${props.error.cause}` : "") +
		(props.error.stack ? `\n\n${props.error.stack}` : "") +
		(props.componentStack ? `\n\n${props.componentStack}` : "")

	return (
		<ErrorMessage
			orientation={useContext(OrientationContext)}
			title="Oops!"
			message={
				<div className="flex flex-col items-center">
					<span className="text-secondary">Sorry, an error occurred in Talisman.</span>
				</div>
			}
			actions={
				<ErrorMessage.Actions>
					{props.error !== undefined && (
						<SurfaceButton className="!rounded-3xl" onClick={() => alert(message)}>
							Show error
						</SurfaceButton>
					)}
					{props.resetError !== undefined && (
						<Button className="!rounded-3xl" onClick={props.resetError}>
							Refresh
						</Button>
					)}
				</ErrorMessage.Actions>
			}
		/>
	)
}

type CapturingErrorBoundaryProps = PropsWithChildren<{
	fallback: (props: ErrorElementProps) => ReactElement
	onReset: (error: Error) => void
}>

type CapturingErrorBoundaryState = { error?: Error; componentStack: string | null }

class CapturingErrorBoundary extends Component<
	CapturingErrorBoundaryProps,
	CapturingErrorBoundaryState
> {
	override state: CapturingErrorBoundaryState = { componentStack: null }

	static getDerivedStateFromError(error: Error): Partial<CapturingErrorBoundaryState> {
		return { error }
	}

	override componentDidCatch(error: Error, { componentStack }: ErrorInfo) {
		this.setState({ componentStack: componentStack ?? null })
		captureError(error, "error_boundary")
	}

	resetError = () => {
		const { error } = this.state
		if (error !== undefined) this.props.onReset(error)
		this.setState({ error: undefined, componentStack: null })
	}

	override render() {
		const { error, componentStack } = this.state
		return error === undefined
			? this.props.children
			: this.props.fallback({ error, componentStack, resetError: this.resetError })
	}
}

export const debugErrorBoundaryState = atom({
	key: "DebugErrorBoundary",
	default: false,
})

const ErrorBoundaryDebuggerChildren = (
	props: PropsWithChildren<{ error?: Error; onTriggerError: () => void }>
) => {
	if (props.error !== undefined) {
		throw props.error
	}

	return (
		<div
			css={{ display: "contents", "> *": { outline: "1px dotted red" } }}
			onContextMenu={(event) => {
				event.preventDefault()
				event.stopPropagation()
				props.onTriggerError()
			}}
		>
			{props.children}
		</div>
	)
}

const ErrorBoundaryDebugger = ({ children, onReset, fallback }: CapturingErrorBoundaryProps) => {
	const [error, setError] = useState<Error>()

	return (
		<CapturingErrorBoundary
			fallback={fallback}
			onReset={(resetError) => {
				onReset(resetError)
				setError(undefined)
			}}
		>
			<ErrorBoundaryDebuggerChildren
				error={error}
				onTriggerError={() => setError(new Error("This is a mock error"))}
			>
				{children}
			</ErrorBoundaryDebuggerChildren>
		</CapturingErrorBoundary>
	)
}

type ErrorBoundaryProps = PropsWithChildren<
	Pick<ErrorMessageProps, "orientation"> & {
		renderFallback?: (fallback: ReactNode) => ReactElement
	}
>

export const ErrorBoundary = ({ orientation, renderFallback, children }: ErrorBoundaryProps) => {
	const fallback = (errorProps: ErrorElementProps) =>
		renderFallback?.(<ErrorElement {...errorProps} />) ?? <ErrorElement {...errorProps} />

	const resetError = useRecoilCallback(
		({ snapshot, refresh }) =>
			(error: Error) => {
				for (const node of snapshot.getNodes_UNSTABLE({ isInitialized: true })) {
					const { loadable, type } = snapshot.getInfo_UNSTABLE(node)
					if (loadable?.state === "hasError" && loadable.contents === error) {
						switch (type) {
							case "atom":
								// As of now Recoil doesn't have the ability to refresh & rerun atom effect
								// https://github.com/facebookexperimental/Recoil/issues/1685
								// https://github.com/facebookexperimental/Recoil/issues/2183
								window.location.reload()
								break
							case "selector":
								return refresh(node)
						}
					}
				}
			},
		[]
	)

	return (
		<OrientationContext.Provider value={orientation}>
			{useRecoilValue(debugErrorBoundaryState) ? (
				<ErrorBoundaryDebugger fallback={fallback} onReset={resetError}>
					{children}
				</ErrorBoundaryDebugger>
			) : (
				<CapturingErrorBoundary fallback={fallback} onReset={resetError}>
					{children}
				</CapturingErrorBoundary>
			)}
		</OrientationContext.Provider>
	)
}
