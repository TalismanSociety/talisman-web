import { BehaviorSubject } from "rxjs"

export const chainReadId$ = new BehaviorSubject(0)

export const bumpChainReadId = () => chainReadId$.next(chainReadId$.value + 1)
