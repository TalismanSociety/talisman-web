type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Date
  ? T
  : {
      [K in keyof T]: T[K] extends Array<infer U>
        ? Array<RecursivelyReplaceNullWithUndefined<U>>
        : RecursivelyReplaceNullWithUndefined<T[K]>
    }

export const nullToUndefined = <T>(obj: T): RecursivelyReplaceNullWithUndefined<T> => {
  if (obj === null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return undefined as any
  }

  // object check based on: https://stackoverflow.com/a/51458052/6489012
  if (obj?.constructor.name === 'Object') {
    for (const key in obj) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj[key] = nullToUndefined(obj[key]) as any
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return obj as any
}
