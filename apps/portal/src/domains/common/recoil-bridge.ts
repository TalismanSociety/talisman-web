import { type AtomEffect, atom } from "recoil"
import type { BehaviorSubject, Observable } from "rxjs"

const followObservable =
	<T>(source$: Observable<T>): AtomEffect<T> =>
	({ setSelf }) => {
		const subscription = source$.subscribe((value) => setSelf(value))
		return () => subscription.unsubscribe()
	}

export const atomFromObservable = <T>(key: string, source$: Observable<T>, defaultValue: T) =>
	atom<T>({
		key,
		default: defaultValue,
		effects: [followObservable(source$)],
		dangerouslyAllowMutability: true,
	})

export const atomFromSubject = <T>(key: string, subject$: BehaviorSubject<T>) => {
	const initialValue = subject$.value
	return atom<T>({
		key,
		default: initialValue,
		effects: [
			({ setSelf, onSet }) => {
				const subscription = subject$.subscribe((value) => setSelf(value))
				onSet((value, _, isReset) => subject$.next(isReset ? initialValue : value))
				return () => subscription.unsubscribe()
			},
		],
		dangerouslyAllowMutability: true,
	})
}
