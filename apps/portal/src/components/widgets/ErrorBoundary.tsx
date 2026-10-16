import { bind } from "@react-rxjs/core"
import type { ErrorInfo, PropsWithChildren, ReactElement, ReactNode } from "react"
import { Component, createContext, useContext, useState } from "react"
import { BehaviorSubject } from "rxjs"
import type { ErrorMessageProps } from "@/components/recipes/ErrorMessage"
import { ErrorMessage } from "@/components/recipes/ErrorMessage"
import { captureError } from "@/domains/analytics/client"
import { Button, SurfaceButton } from "@/ui/atoms/Button"
import { retryStreamError } from "@/util/loadable"

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

const debugErrorBoundary$ = new BehaviorSubject(false)

export const [useDebugErrorBoundary] = bind(debugErrorBoundary$, false)

export const setDebugErrorBoundary = (debug: boolean) => debugErrorBoundary$.next(debug)

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
			onReset={(caughtError) => {
				onReset(caughtError)
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

	return (
		<OrientationContext.Provider value={orientation}>
			{useDebugErrorBoundary() ? (
				<ErrorBoundaryDebugger fallback={fallback} onReset={retryStreamError}>
					{children}
				</ErrorBoundaryDebugger>
			) : (
				<CapturingErrorBoundary fallback={fallback} onReset={retryStreamError}>
					{children}
				</CapturingErrorBoundary>
			)}
		</OrientationContext.Provider>
	)
}
