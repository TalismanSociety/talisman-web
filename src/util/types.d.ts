type Diverge<TType, TIntersect> = TType extends infer TDiverge & TIntersect ? TDiverge : TType

type Leading<T extends any[]> = T extends [...infer Leading, any] ? Leading : []

type PickKnownKeys<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}
