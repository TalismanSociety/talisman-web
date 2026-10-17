import { bind, SUSPENSE, Subscribe } from "@react-rxjs/core"
import { act, render, screen } from "@testing-library/react"
import { Component, type ReactNode, StrictMode, Suspense, useState } from "react"
import { BehaviorSubject, filter, map } from "rxjs"
import { expect, it } from "vitest"

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
	override state: { error?: Error } = {}
	static getDerivedStateFromError(error: Error) {
		return { error }
	}
	override render() {
		return this.state.error ? <p>failed: {this.state.error.name}</p> : this.props.children
	}
}

const watched$ = new BehaviorSubject<boolean | typeof SUSPENSE>(SUSPENSE)
const [useWatched] = bind(watched$)
const late$ = new BehaviorSubject("")
const [useLate] = bind(late$.pipe(filter(Boolean)))
const [useEarly] = bind(late$.pipe(map(() => "early")))

let mountLate = () => {}

const Watcher = () => {
	useWatched()
	return null
}

const Late = () => <p>late {useLate()}</p>

const Page = () => {
	const early = useEarly()
	const [late, setLate] = useState(false)
	mountLate = () => setLate(true)
	return (
		<>
			<p>{early}</p>
			{late && <Late />}
		</>
	)
}

it.each([false, true])(
	"a state first read after a Suspense reveal subscribes in StrictMode (suspends again: %s)",
	async (suspendsAgain) => {
		watched$.next(SUSPENSE)
		late$.next("")
		const { unmount } = render(
			<StrictMode>
				<Boundary>
					<Subscribe>
						<Suspense fallback={<p>loading</p>}>
							<Watcher />
							<Suspense>
								<Page />
							</Suspense>
						</Suspense>
					</Subscribe>
				</Boundary>
			</StrictMode>
		)
		await act(async () => watched$.next(true))
		await screen.findByText("early")
		if (suspendsAgain) {
			await act(async () => watched$.next(SUSPENSE))
			expect(screen.queryByText("loading")).not.toBeNull()
			await act(async () => watched$.next(true))
			await screen.findByText("early")
		}
		await act(async () => mountLate())
		await act(async () => late$.next("value"))
		expect(screen.queryByText(/late value|failed/)?.textContent).toBe("late value")
		unmount()
	}
)
