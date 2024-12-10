type Diverge<TType, TIntersect> = TType extends infer TDiverge & TIntersect ? TDiverge : TType

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Leading<T extends any[]> = T extends [...infer Leading, any] ? Leading : []

type PickKnownKeys<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
}
